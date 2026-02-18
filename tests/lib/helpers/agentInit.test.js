const t = require('tap')
t.jobs = 1

const agentInitPath = require.resolve('../../../src/lib/helpers/agentInit')
const dotenvxPath = require.resolve('@dotenvx/dotenvx')
const identityPath = require.resolve('../../../src/lib/helpers/identity')
const keypairPath = require.resolve('../../../src/lib/helpers/keypair')
const touchPath = require.resolve('../../../src/lib/helpers/touch')
const postRegisterPath = require.resolve('../../../src/lib/api/postRegister')
let originalAgentHostname
let originalDotenvxModule
let originalIdentityModule
let originalKeypairModule
let originalTouchModule
let originalPostRegisterModule
let constructorArgs
let dotenvSetCalls

function mockAgentInitDeps (registerResponse = { uid: 'agent-test', is_new: true }) {
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

  require.cache[identityPath] = {
    exports: () => ({ privateJwk: null })
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

  require.cache[postRegisterPath] = {
    exports: class PostRegister {
      constructor (hostname, publicJwk) {
        constructorArgs.push({ hostname, publicJwk })
      }

      async run () {
        return registerResponse
      }
    }
  }

  delete require.cache[agentInitPath]
}

t.beforeEach(() => {
  originalAgentHostname = process.env.AGENT_HOSTNAME
  originalDotenvxModule = require.cache[dotenvxPath]
  originalIdentityModule = require.cache[identityPath]
  originalKeypairModule = require.cache[keypairPath]
  originalTouchModule = require.cache[touchPath]
  originalPostRegisterModule = require.cache[postRegisterPath]

  constructorArgs = []
  dotenvSetCalls = []
  delete require.cache[agentInitPath]
})

t.afterEach(() => {
  if (originalDotenvxModule) require.cache[dotenvxPath] = originalDotenvxModule
  else delete require.cache[dotenvxPath]

  if (originalIdentityModule) require.cache[identityPath] = originalIdentityModule
  else delete require.cache[identityPath]

  if (originalKeypairModule) require.cache[keypairPath] = originalKeypairModule
  else delete require.cache[keypairPath]

  if (originalTouchModule) require.cache[touchPath] = originalTouchModule
  else delete require.cache[touchPath]

  if (originalPostRegisterModule) require.cache[postRegisterPath] = originalPostRegisterModule
  else delete require.cache[postRegisterPath]

  delete require.cache[agentInitPath]

  if (originalAgentHostname === undefined) delete process.env.AGENT_HOSTNAME
  else process.env.AGENT_HOSTNAME = originalAgentHostname
})

t.test('agentInit normalizes hostname arg when provided', async t => {
  process.env.AGENT_HOSTNAME = 'api.from-env.com'

  mockAgentInitDeps()

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit('api.from-flag.com')

  t.equal(constructorArgs[0].hostname, 'https://api.from-flag.com')
  const hasPublicJwkSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_PUBLIC_JWK')
  const hasPrivateJwkSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_PRIVATE_JWK')
  const hasUidSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_UID')
  const hasAgentHostnameSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_HOSTNAME' && call[1] === 'api.from-flag.com')
  t.equal(hasPublicJwkSet, true)
  t.equal(hasPrivateJwkSet, true)
  t.equal(hasUidSet, true)
  t.equal(hasAgentHostnameSet, true)
})

t.test('agentInit uses AGENT_HOSTNAME when arg is not provided', async t => {
  process.env.AGENT_HOSTNAME = 'api.from-env.com'

  mockAgentInitDeps()

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit()

  t.equal(constructorArgs[0].hostname, 'https://api.from-env.com')
  const hasAgentHostnameSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_HOSTNAME' && call[1] === 'api.from-env.com')
  t.equal(hasAgentHostnameSet, true)
})

t.test('agentInit defaults register URL to api.vestauth.com', async t => {
  delete process.env.AGENT_HOSTNAME

  mockAgentInitDeps()

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit()

  t.equal(constructorArgs[0].hostname, 'https://api.vestauth.com')
  const hasAgentHostnameSet = dotenvSetCalls.some((call) => call[0] === 'AGENT_HOSTNAME')
  t.equal(hasAgentHostnameSet, false)
})

t.test('agentInit rejects hostname values with path', async t => {
  delete process.env.AGENT_HOSTNAME

  mockAgentInitDeps()

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await t.rejects(() => agentInit('https://api.example.com/path'))

  t.equal(constructorArgs.length, 0)
})
