const t = require('tap')

const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')

t.test('#headers - deterministic signature input and format', async t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const { privateKey } = keypair()
  const privateKeyString = JSON.stringify(privateKey)

  const result = await headers('GET', 'https://example.com/resource', privateKeyString, 'agent-123', 'vestauth', 'nonce-123')

  t.type(result, 'object')
  t.equal(Object.keys(result).length, 3)
  t.ok(result.Signature, 'Signature header exists')
  t.ok(result['Signature-Input'], 'Signature-Input header exists')
  t.equal(result['Signature-Agent'], 'imlement')
  t.match(result.Signature, /^sig1=:[A-Za-z0-9+/=]+:$/)
  t.equal(
    result['Signature-Input'],
    'sig1=("@authority");' +
      'created=1700000000;' +
      `keyid="${privateKey.kid}";` +
      'alg="ed25519";' +
      'expires=1700000300;' +
      'nonce="nonce-123";' +
      'tag="vestauth"'
  )

  Date.now = originalNow
})

t.test('#headers - null privateKey string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', null),
    new Error('missing privateKey')
  )
})

t.test('#headers - empty privateKey string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', ''),
    new Error('missing privateKey')
  )
})
