const t = require('tap')
t.jobs = 1

const servicePath = require.resolve('../../../src/server/services/registerService')
const primitivesPath = require.resolve('../../../src/lib/primitives')

let originalPrimitivesModule

t.beforeEach(() => {
  originalPrimitivesModule = require.cache[primitivesPath]
  delete require.cache[servicePath]
})

t.afterEach(() => {
  if (originalPrimitivesModule) require.cache[primitivesPath] = originalPrimitivesModule
  else delete require.cache[primitivesPath]

  delete require.cache[servicePath]
})

t.test('creates a new agent and public_jwk when kid is not already registered', async t => {
  const verifyCalls = []
  const publicJwkFindOneCalls = []
  const agentCreateCalls = []
  const publicJwkCreateCalls = []

  require.cache[primitivesPath] = {
    exports: {
      verify: async (...args) => {
        verifyCalls.push(args)
        return {
          kid: 'kid-new',
          public_jwk: { kty: 'OKP', kid: 'kid-new', x: 'abc' }
        }
      }
    }
  }

  const models = {
    agent: {
      create: async () => {
        agentCreateCalls.push(true)
        return { id: 42, uid: 'abc123' }
      }
    },
    public_jwk: {
      findOne: async (criteria) => {
        publicJwkFindOneCalls.push(criteria)
        return null
      },
      create: async (attrs) => {
        publicJwkCreateCalls.push(attrs)
        return {
          id: 7,
          agent: attrs.agent,
          kid: attrs.kid,
          value: attrs.value,
          state: 'active'
        }
      }
    }
  }

  const RegisterService = require('../../../src/server/services/registerService')
  const result = await new RegisterService({
    models,
    httpMethod: 'POST',
    uri: 'https://api.example.com/register',
    headers: { host: 'api.example.com' },
    publicJwk: { kty: 'OKP', kid: 'kid-new', x: 'abc' }
  }).run()

  t.equal(verifyCalls.length, 1)
  t.same(verifyCalls[0], [
    'POST',
    'https://api.example.com/register',
    { host: 'api.example.com' },
    { kty: 'OKP', kid: 'kid-new', x: 'abc' }
  ])

  t.same(publicJwkFindOneCalls, [{ kid: 'kid-new' }])
  t.equal(agentCreateCalls.length, 1)
  t.same(publicJwkCreateCalls, [{
    agent: 42,
    kid: 'kid-new',
    value: { kty: 'OKP', kid: 'kid-new', x: 'abc' }
  }])

  t.equal(result.agent.id, 42)
  t.same(result.publicJwk, { kty: 'OKP', kid: 'kid-new', x: 'abc' })
  t.equal(result.isNew, true)
})

t.test('returns existing agent when kid is already registered', async t => {
  const agentCreateCalls = []
  const publicJwkCreateCalls = []
  const agentFindOneCalls = []

  require.cache[primitivesPath] = {
    exports: {
      verify: async () => ({
        kid: 'kid-existing',
        public_jwk: { kty: 'OKP', kid: 'kid-existing', x: 'ignored' }
      })
    }
  }

  const models = {
    agent: {
      create: async () => {
        agentCreateCalls.push(true)
        return { id: 99 }
      },
      findOne: async (criteria) => {
        agentFindOneCalls.push(criteria)
        return { id: 5, uid: 'existing' }
      }
    },
    public_jwk: {
      findOne: async () => ({
        id: 11,
        agent: 5,
        kid: 'kid-existing',
        value: { kty: 'OKP', kid: 'kid-existing', x: 'saved' },
        state: 'active'
      }),
      create: async (attrs) => {
        publicJwkCreateCalls.push(attrs)
        return attrs
      }
    }
  }

  const RegisterService = require('../../../src/server/services/registerService')
  const result = await new RegisterService({
    models,
    httpMethod: 'POST',
    uri: 'https://api.example.com/register',
    headers: {},
    publicJwk: { kty: 'OKP', kid: 'kid-existing', x: 'ignored' }
  }).run()

  t.same(agentFindOneCalls, [{ id: 5 }])
  t.equal(agentCreateCalls.length, 0)
  t.equal(publicJwkCreateCalls.length, 0)

  t.same(result, {
    agent: { id: 5, uid: 'existing' },
    publicJwk: { kty: 'OKP', kid: 'kid-existing', x: 'saved' },
    isNew: false
  })
})
