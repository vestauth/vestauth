const t = require('tap')
t.jobs = 1

const normalizeAgentHostname = require('../../../src/lib/helpers/normalizeAgentHostname')
const normalizeAgentHostnamePath = require.resolve('../../../src/lib/helpers/normalizeAgentHostname')
const envPath = require.resolve('../../../src/lib/helpers/env')

t.test('normalizeAgentHostname normalizes plain hostname to https origin', async t => {
  const original = process.env.AGENT_HOSTNAME
  delete process.env.AGENT_HOSTNAME
  t.teardown(() => {
    if (original === undefined) delete process.env.AGENT_HOSTNAME
    else process.env.AGENT_HOSTNAME = original
  })

  t.equal(normalizeAgentHostname('api.example.com'), 'https://api.example.com')
})

t.test('normalizeAgentHostname uses AGENT_HOSTNAME when arg is not provided', async t => {
  const original = process.env.AGENT_HOSTNAME
  process.env.AGENT_HOSTNAME = 'api.from-env.com'
  t.teardown(() => {
    if (original === undefined) delete process.env.AGENT_HOSTNAME
    else process.env.AGENT_HOSTNAME = original
  })

  t.equal(normalizeAgentHostname(), 'https://api.from-env.com')
})

t.test('normalizeAgentHostname rejects path/query/hash', async t => {
  t.throws(
    () => normalizeAgentHostname('https://api.example.com/path?q=1#x'),
    new Error('invalid --hostname. path/query/hash are not allowed')
  )
})

t.test('normalizeAgentHostname uses dotenv env helper when AGENT_HOSTNAME exists in .env', async t => {
  const original = process.env.AGENT_HOSTNAME
  delete process.env.AGENT_HOSTNAME

  const originalEnvModule = require.cache[envPath]
  require.cache[envPath] = {
    exports: (key) => (key === 'AGENT_HOSTNAME' ? 'api.from-dotenv.com' : null)
  }
  delete require.cache[normalizeAgentHostnamePath]

  const mockedNormalizeAgentHostname = require('../../../src/lib/helpers/normalizeAgentHostname')

  t.teardown(() => {
    if (originalEnvModule) require.cache[envPath] = originalEnvModule
    else delete require.cache[envPath]

    delete require.cache[normalizeAgentHostnamePath]

    if (original === undefined) delete process.env.AGENT_HOSTNAME
    else process.env.AGENT_HOSTNAME = original
  })

  t.equal(mockedNormalizeAgentHostname(), 'https://api.from-dotenv.com')
})
