const t = require('tap')

const normalizeAgentHostname = require('../../../src/lib/helpers/normalizeAgentHostname')

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
