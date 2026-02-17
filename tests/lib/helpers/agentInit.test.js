const t = require('tap')

const agentInitPath = require.resolve('../../../src/lib/helpers/agentInit')
const dotenvxPath = require.resolve('@dotenvx/dotenvx')
const identityPath = require.resolve('../../../src/lib/helpers/identity')
const keypairPath = require.resolve('../../../src/lib/helpers/keypair')
const touchPath = require.resolve('../../../src/lib/helpers/touch')
const postRegisterPath = require.resolve('../../../src/lib/api/postRegister')

function mockAgentInitDeps (registerResponse = { uid: 'agent-test', is_new: true }) {
  const constructorArgs = []

  const originals = {
    dotenvx: require.cache[dotenvxPath],
    identity: require.cache[identityPath],
    keypair: require.cache[keypairPath],
    touch: require.cache[touchPath],
    postRegister: require.cache[postRegisterPath]
  }

  require.cache[dotenvxPath] = {
    exports: {
      set: () => {}
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

  return {
    constructorArgs,
    restore: () => {
      if (originals.dotenvx) require.cache[dotenvxPath] = originals.dotenvx
      else delete require.cache[dotenvxPath]

      if (originals.identity) require.cache[identityPath] = originals.identity
      else delete require.cache[identityPath]

      if (originals.keypair) require.cache[keypairPath] = originals.keypair
      else delete require.cache[keypairPath]

      if (originals.touch) require.cache[touchPath] = originals.touch
      else delete require.cache[touchPath]

      if (originals.postRegister) require.cache[postRegisterPath] = originals.postRegister
      else delete require.cache[postRegisterPath]

      delete require.cache[agentInitPath]
    }
  }
}

t.test('agentInit uses options.registerUrl when provided', async t => {
  const original = process.env.AGENT_REGISTER_URL
  process.env.AGENT_REGISTER_URL = 'https://api.from-env.com'

  const { constructorArgs, restore } = mockAgentInitDeps()
  t.teardown(() => {
    restore()
    if (original === undefined) delete process.env.AGENT_REGISTER_URL
    else process.env.AGENT_REGISTER_URL = original
  })

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit('https://api.from-flag.com')

  t.equal(constructorArgs[0].hostname, 'https://api.from-flag.com')
})

t.test('agentInit uses AGENT_REGISTER_URL when option is not provided', async t => {
  const original = process.env.AGENT_REGISTER_URL
  process.env.AGENT_REGISTER_URL = 'https://api.from-env.com'

  const { constructorArgs, restore } = mockAgentInitDeps()
  t.teardown(() => {
    restore()
    if (original === undefined) delete process.env.AGENT_REGISTER_URL
    else process.env.AGENT_REGISTER_URL = original
  })

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit()

  t.equal(constructorArgs[0].hostname, 'https://api.from-env.com')
})

t.test('agentInit defaults register URL to api.vestauth.com', async t => {
  const original = process.env.AGENT_REGISTER_URL
  delete process.env.AGENT_REGISTER_URL

  const { constructorArgs, restore } = mockAgentInitDeps()
  t.teardown(() => {
    restore()
    if (original === undefined) delete process.env.AGENT_REGISTER_URL
    else process.env.AGENT_REGISTER_URL = original
  })

  const agentInit = require('../../../src/lib/helpers/agentInit')
  await agentInit()

  t.equal(constructorArgs[0].hostname, 'https://api.vestauth.com')
})
