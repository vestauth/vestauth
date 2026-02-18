const t = require('tap')
t.jobs = 1

const normalizeAgentHostnamePath = require.resolve('../../../src/lib/helpers/normalizeAgentHostname')
const envPath = require.resolve('../../../src/lib/helpers/env')
let originalAgentHostname
let originalEnvModule

function loadNormalizeAgentHostname () {
  delete require.cache[normalizeAgentHostnamePath]
  return require('../../../src/lib/helpers/normalizeAgentHostname')
}

t.beforeEach(() => {
  originalAgentHostname = process.env.AGENT_HOSTNAME
  originalEnvModule = require.cache[envPath]
  delete require.cache[normalizeAgentHostnamePath]
})

t.afterEach(() => {
  if (originalEnvModule) require.cache[envPath] = originalEnvModule
  else delete require.cache[envPath]

  delete require.cache[normalizeAgentHostnamePath]

  if (originalAgentHostname === undefined) delete process.env.AGENT_HOSTNAME
  else process.env.AGENT_HOSTNAME = originalAgentHostname
})

t.test('normalizeAgentHostname normalizes plain hostname to https origin', async t => {
  delete process.env.AGENT_HOSTNAME

  const normalizeAgentHostname = loadNormalizeAgentHostname()
  t.equal(normalizeAgentHostname('api.example.com'), 'https://api.example.com')
})

t.test('normalizeAgentHostname uses AGENT_HOSTNAME when arg is not provided', async t => {
  process.env.AGENT_HOSTNAME = 'api.from-env.com'
  require.cache[envPath] = {
    exports: (key) => process.env[key] || null
  }

  const normalizeAgentHostname = loadNormalizeAgentHostname()
  t.equal(normalizeAgentHostname(), 'https://api.from-env.com')
})

t.test('normalizeAgentHostname rejects path/query/hash', async t => {
  const normalizeAgentHostname = loadNormalizeAgentHostname()
  t.throws(
    () => normalizeAgentHostname('https://api.example.com/path?q=1#x'),
    new Error('invalid --hostname. path/query/hash are not allowed')
  )
})

t.test('normalizeAgentHostname uses dotenv env helper when AGENT_HOSTNAME exists in .env', async t => {
  delete process.env.AGENT_HOSTNAME

  require.cache[envPath] = {
    exports: (key) => (key === 'AGENT_HOSTNAME' ? 'api.from-dotenv.com' : null)
  }
  const normalizeAgentHostname = loadNormalizeAgentHostname()

  t.equal(normalizeAgentHostname(), 'https://api.from-dotenv.com')
})
