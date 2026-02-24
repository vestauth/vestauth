const t = require('tap')
t.jobs = 1

const servicePath = require.resolve('../../../src/server/services/rotateService')
const primitivesPath = require.resolve('../../../src/lib/primitives')
const parseSignatureInputHeaderPath = require.resolve('../../../src/lib/helpers/parseSignatureInputHeader')

let originalPrimitivesModule
let originalParseSignatureInputHeaderModule

t.beforeEach(() => {
  originalPrimitivesModule = require.cache[primitivesPath]
  originalParseSignatureInputHeaderModule = require.cache[parseSignatureInputHeaderPath]
  delete require.cache[servicePath]
})

t.afterEach(() => {
  if (originalPrimitivesModule) require.cache[primitivesPath] = originalPrimitivesModule
  else delete require.cache[primitivesPath]

  if (originalParseSignatureInputHeaderModule) require.cache[parseSignatureInputHeaderPath] = originalParseSignatureInputHeaderModule
  else delete require.cache[parseSignatureInputHeaderPath]

  delete require.cache[servicePath]
})

t.test('rotates keys by verifying current key, creating new key, and revoking current key', async t => {
  const verifyCalls = []
  const selectCalls = []
  const whereCalls = []
  const firstCalls = []
  const insertCalls = []
  const updateCalls = []
  const transactionCalls = []
  const publicJwkFindOneCalls = []
  const agentFindOneCalls = []

  require.cache[parseSignatureInputHeaderPath] = {
    exports: () => ({ keyid: 'kid-current' })
  }

  require.cache[primitivesPath] = {
    exports: {
      verify: async (...args) => {
        verifyCalls.push(args)
        return { ok: true }
      }
    }
  }

  const trxExistingNewPublicJwk = null
  const trx = (table) => {
    const builder = {
      select (cols) {
        selectCalls.push({ table, cols })
        return builder
      },
      where (criteria) {
        whereCalls.push({ table, criteria })
        builder._where = criteria
        return builder
      },
      first: async () => {
        firstCalls.push({ table, where: builder._where || null })
        return trxExistingNewPublicJwk
      },
      insert: async (attrs) => {
        insertCalls.push({ table, attrs })
        return []
      },
      update: async (attrs) => {
        updateCalls.push({ table, where: builder._where || null, attrs })
        return 1
      }
    }
    return builder
  }

  const models = {
    agent: {
      findOne: async (criteria) => {
        agentFindOneCalls.push(criteria)
        return { id: 5, uid: 'agent123', toJSON: () => ({ uidFormatted: 'agent-agent123' }) }
      }
    },
    public_jwk: {
      db: {
        transaction: async (fn) => {
          transactionCalls.push(true)
          return fn(trx)
        }
      },
      findOne: async (criteria) => {
        publicJwkFindOneCalls.push(criteria)

        if (criteria.kid === 'kid-current') {
          return {
            id: 11,
            agent: 5,
            kid: 'kid-current',
            value: { kty: 'OKP', kid: 'kid-current', x: 'old' },
            state: 'active'
          }
        }

        if (criteria.kid === 'kid-new') {
          return {
            id: 12,
            agent: 5,
            kid: 'kid-new',
            value: { kty: 'OKP', kid: 'kid-new', x: 'new' },
            state: 'active'
          }
        }

        return null
      }
    }
  }

  const RotateService = require('../../../src/server/services/rotateService')
  const result = await new RotateService({
    models,
    httpMethod: 'POST',
    uri: 'https://api.example.com/rotate',
    headers: { 'signature-input': 'sig1=("@authority");keyid="kid-current"' },
    publicJwk: { kty: 'OKP', kid: 'kid-new', x: 'new' }
  }).run()

  t.equal(transactionCalls.length, 1)
  t.same(publicJwkFindOneCalls, [{ kid: 'kid-current' }, { kid: 'kid-new' }])
  t.same(agentFindOneCalls, [{ id: 5 }])
  t.same(verifyCalls, [[
    'POST',
    'https://api.example.com/rotate',
    { 'signature-input': 'sig1=("@authority");keyid="kid-current"' },
    { kty: 'OKP', kid: 'kid-current', x: 'old' }
  ]])

  t.equal(selectCalls.length, 1)
  t.same(selectCalls[0], { table: 'public_jwks', cols: ['id', 'agent_id', 'kid'] })
  t.same(firstCalls[0], { table: 'public_jwks', where: { kid: 'kid-new' } })

  t.equal(insertCalls.length, 1)
  t.equal(insertCalls[0].table, 'public_jwks')
  t.equal(insertCalls[0].attrs.agent_id, 5)
  t.equal(insertCalls[0].attrs.kid, 'kid-new')
  t.same(insertCalls[0].attrs.value, { kty: 'OKP', kid: 'kid-new', x: 'new' })
  t.equal(insertCalls[0].attrs.state, 'active')
  t.type(insertCalls[0].attrs.created_at, Date)
  t.type(insertCalls[0].attrs.updated_at, Date)

  t.equal(updateCalls.length, 1)
  t.same(updateCalls[0].where, { id: 11 })
  t.equal(updateCalls[0].attrs.state, 'revoked')
  t.type(updateCalls[0].attrs.updated_at, Date)

  t.equal(result.agent.id, 5)
  t.equal(result.publicJwk.kid, 'kid-new')
  t.same(result.publicJwk.value, { kty: 'OKP', kid: 'kid-new', x: 'new' })
})

t.test('throws when current kid is missing from signature-input', async t => {
  require.cache[parseSignatureInputHeaderPath] = {
    exports: () => ({})
  }

  let verifyCalled = false
  require.cache[primitivesPath] = {
    exports: {
      verify: async () => {
        verifyCalled = true
      }
    }
  }

  const RotateService = require('../../../src/server/services/rotateService')

  await t.rejects(
    () => new RotateService({
      models: { public_jwk: {}, agent: {} },
      httpMethod: 'POST',
      uri: 'https://api.example.com/rotate',
      headers: { 'signature-input': 'sig1=()' },
      publicJwk: { kid: 'kid-new' }
    }).run(),
    /kid missing/
  )

  t.equal(verifyCalled, false)
})

t.test('throws when new kid is missing from request public_jwk', async t => {
  require.cache[parseSignatureInputHeaderPath] = {
    exports: () => ({ keyid: 'kid-current' })
  }

  let verifyCalled = false
  require.cache[primitivesPath] = {
    exports: {
      verify: async () => {
        verifyCalled = true
      }
    }
  }

  const RotateService = require('../../../src/server/services/rotateService')

  await t.rejects(
    () => new RotateService({
      models: { public_jwk: {}, agent: {} },
      httpMethod: 'POST',
      uri: 'https://api.example.com/rotate',
      headers: { 'signature-input': 'sig1=()' },
      publicJwk: { kty: 'OKP' }
    }).run(),
    /new kid missing/
  )

  t.equal(verifyCalled, false)
})
