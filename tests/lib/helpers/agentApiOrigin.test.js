const t = require('tap')

const normalizeAgentApiOrigin = require('../../../src/lib/helpers/normalizeAgentApiOrigin')

t.test('normalizeAgentApiOrigin normalizes plain hostname to https origin', async t => {
  const original = process.env.AGENT_HOSTNAME
  delete process.env.AGENT_HOSTNAME
  t.teardown(() => {
    if (original === undefined) delete process.env.AGENT_HOSTNAME
    else process.env.AGENT_HOSTNAME = original
  })

  t.equal(normalizeAgentApiOrigin('api.example.com'), 'https://api.example.com')
})

t.test('normalizeAgentApiOrigin uses AGENT_HOSTNAME when arg is not provided', async t => {
  const original = process.env.AGENT_HOSTNAME
  process.env.AGENT_HOSTNAME = 'api.from-env.com'
  t.teardown(() => {
    if (original === undefined) delete process.env.AGENT_HOSTNAME
    else process.env.AGENT_HOSTNAME = original
  })

  t.equal(normalizeAgentApiOrigin(), 'https://api.from-env.com')
})

t.test('normalizeAgentApiOrigin rejects path/query/hash', async t => {
  t.throws(
    () => normalizeAgentApiOrigin('https://api.example.com/path?q=1#x'),
    new Error('invalid --hostname. path/query/hash are not allowed')
  )
})
