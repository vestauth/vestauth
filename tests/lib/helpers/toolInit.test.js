const t = require('tap')
t.jobs = 1

const toolInitPath = require.resolve('../../../src/lib/helpers/toolInit')
const dotenvxPath = require.resolve('@dotenvx/dotenvx')
const keypairPath = require.resolve('../../../src/lib/helpers/keypair')
const touchPath = require.resolve('../../../src/lib/helpers/touch')
const postToolRegisterPath = require.resolve('../../../src/lib/api/postToolRegister')
let originalToolHostname
let originalDotenvxModule
let originalKeypairModule
let originalTouchModule
let originalPostToolRegisterModule
let constructorArgs
let dotenvSetCalls

function mockToolInitDeps (registerResponse = { uid: 'tool-test', is_new: true }) {
  constructorArgs = []
  dotenvSetCalls = []

  require.cache[dotenvxPath] = {
    exports: {
      get: (key) => {
        if (Object.prototype.hasOwnProperty.call(process.env, key)) {
          return process.env[key]
        }
        throw new Error('missing')
      },
      set: (...args) => {
        dotenvSetCalls.push(args)
      }
    }
  }

  require.cache[keypairPath] = {
    exports: () => ({
      publicJwk: { kty: 'OKP', x: 'abc', kid: 'kid-1', crv: 'Ed25519' },
      privateJwk: { kty: 'OKP', d: 'def', x: 'abc', kid: 'kid-1', crv: 'Ed25519' }
    })
  }

  require.cache[touchPath] = {
    exports: () => {}
  }

  require.cache[postToolRegisterPath] = {
    exports: class PostToolRegister {
      constructor (hostname, publicJwk) {
        constructorArgs.push({ hostname, publicJwk })
      }

      async run () {
        return registerResponse
      }
    }
  }

  delete require.cache[toolInitPath]
}

t.beforeEach(() => {
  originalToolHostname = process.env.TOOL_HOSTNAME
  originalDotenvxModule = require.cache[dotenvxPath]
  originalKeypairModule = require.cache[keypairPath]
  originalTouchModule = require.cache[touchPath]
  originalPostToolRegisterModule = require.cache[postToolRegisterPath]

  constructorArgs = []
  dotenvSetCalls = []
  delete require.cache[toolInitPath]
})

t.afterEach(() => {
  if (originalDotenvxModule) require.cache[dotenvxPath] = originalDotenvxModule
  else delete require.cache[dotenvxPath]

  if (originalKeypairModule) require.cache[keypairPath] = originalKeypairModule
  else delete require.cache[keypairPath]

  if (originalTouchModule) require.cache[touchPath] = originalTouchModule
  else delete require.cache[touchPath]

  if (originalPostToolRegisterModule) require.cache[postToolRegisterPath] = originalPostToolRegisterModule
  else delete require.cache[postToolRegisterPath]

  delete require.cache[toolInitPath]

  if (originalToolHostname === undefined) delete process.env.TOOL_HOSTNAME
  else process.env.TOOL_HOSTNAME = originalToolHostname
})

t.test('toolInit normalizes hostname arg when provided', async t => {
  process.env.TOOL_HOSTNAME = 'api.from-env.com'

  mockToolInitDeps()

  const toolInit = require('../../../src/lib/helpers/toolInit')
  await toolInit('api.from-flag.com')

  t.equal(constructorArgs[0].hostname, 'https://api.from-flag.com')
  const hasPublicJwkSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_PUBLIC_JWK')
  const hasPrivateJwkSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_PRIVATE_JWK')
  const hasUidSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_UID')
  const hasToolHostnameSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_HOSTNAME' && call[1] === 'https://api.from-flag.com')
  t.equal(hasPublicJwkSet, true)
  t.equal(hasPrivateJwkSet, true)
  t.equal(hasUidSet, true)
  t.equal(hasToolHostnameSet, true)
})

t.test('toolInit uses TOOL_HOSTNAME when arg is not provided', async t => {
  process.env.TOOL_HOSTNAME = 'api.from-env.com'

  mockToolInitDeps()

  const toolInit = require('../../../src/lib/helpers/toolInit')
  await toolInit()

  t.equal(constructorArgs[0].hostname, 'https://api.from-env.com')
  const hasToolHostnameSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_HOSTNAME' && call[1] === 'https://api.from-env.com')
  t.equal(hasToolHostnameSet, true)
})

t.test('toolInit preserves http scheme when explicitly provided', async t => {
  delete process.env.TOOL_HOSTNAME

  mockToolInitDeps()

  const toolInit = require('../../../src/lib/helpers/toolInit')
  await toolInit('http://localhost:3000')

  t.equal(constructorArgs[0].hostname, 'http://localhost:3000')
  const hasToolHostnameSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_HOSTNAME' && call[1] === 'http://localhost:3000')
  t.equal(hasToolHostnameSet, true)
})

t.test('toolInit defaults register URL to api.vestauth.com', async t => {
  delete process.env.TOOL_HOSTNAME

  mockToolInitDeps()

  const toolInit = require('../../../src/lib/helpers/toolInit')
  await toolInit()

  t.equal(constructorArgs[0].hostname, 'https://api.vestauth.com')
  const hasToolHostnameSet = dotenvSetCalls.some((call) => call[0] === 'TOOL_HOSTNAME')
  t.equal(hasToolHostnameSet, false)
})

t.test('toolInit rejects hostname values with path', async t => {
  delete process.env.TOOL_HOSTNAME

  mockToolInitDeps()

  const toolInit = require('../../../src/lib/helpers/toolInit')
  await t.rejects(() => toolInit('https://api.example.com/path'))

  t.equal(constructorArgs.length, 0)
})
