const t = require('tap')

const main = require('../../src/lib/main')
const keypair = require('../../src/lib/helpers/keypair')

t.test('lib/main#agent.headers - deterministic signature input and format', async t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await main.agent.headers(
    'GET',
    'https://example.com/resource',
    'agent-123',
    privateJwkString,
    undefined,
    'nonce-123'
  )

  t.type(result, 'object')
  t.equal(Object.keys(result).length, 3)
  t.equal(result['Signature-Agent'], 'sig1=agent-123.api.vestauth.com')

  Date.now = originalNow
})
