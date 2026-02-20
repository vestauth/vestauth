const t = require('tap')

const agentHeaders = require('../../../src/lib/helpers/agentHeaders')
const keypair = require('../../../src/lib/helpers/keypair')

t.beforeEach(() => {
  delete process.env.AGENT_HOSTNAME
})

t.afterEach(() => {
  delete process.env.AGENT_HOSTNAME
})

t.test('#agentHeaders - uses explicit hostname when passed', async t => {
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await agentHeaders(
    'GET',
    'https://example.com/resource',
    'agent-123',
    privateJwkString,
    undefined,
    null,
    'https://api.from-arg.internal'
  )

  t.equal(result['Signature-Agent'], 'sig1="https://agent-123.api.from-arg.internal"')
})

t.test('#agentHeaders - explicit hostname overrides AGENT_HOSTNAME', async t => {
  process.env.AGENT_HOSTNAME = 'api.from-env.internal'
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await agentHeaders(
    'GET',
    'https://example.com/resource',
    'agent-123',
    privateJwkString,
    undefined,
    null,
    'https://api.from-arg.internal'
  )

  t.equal(result['Signature-Agent'], 'sig1="https://agent-123.api.from-arg.internal"')
})

t.test('#agentHeaders - uses AGENT_HOSTNAME scheme when set to http', async t => {
  process.env.AGENT_HOSTNAME = 'http://localhost:3000'
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await agentHeaders('GET', 'https://example.com/resource', 'agent-123', privateJwkString)

  t.equal(result['Signature-Agent'], 'sig1="http://agent-123.localhost:3000"')
})
