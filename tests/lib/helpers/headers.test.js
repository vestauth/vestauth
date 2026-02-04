const t = require('tap')

const Errors = require('../../../src/lib/helpers/errors')
const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')

t.test('#headers - deterministic signature input and format', async t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await headers('GET', 'https://example.com/resource', 'agent-123', privateJwkString, undefined, 'nonce-123')

  t.type(result, 'object')
  t.equal(Object.keys(result).length, 3)
  t.ok(result.Signature, 'Signature header exists')
  t.ok(result['Signature-Input'], 'Signature-Input header exists')
  t.equal(result['Signature-Agent'], 'sig1=agent-123.agents.vestauth.com')
  t.match(result.Signature, /^sig1=:[A-Za-z0-9+/=]+:$/)
  t.equal(
    result['Signature-Input'],
    'sig1=("@authority");' +
      'created=1700000000;' +
      `keyid="${privateJwk.kid}";` +
      'alg="ed25519";' +
      'expires=1700000300;' +
      'nonce="nonce-123";' +
      'tag="web-bot-auth"'
  )

  Date.now = originalNow
})

t.test('#headers - null privateJwk string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', 'agent-123', null),
    new Errors().missingPrivateJwk()
  )
})

t.test('#headers - empty privateJwk string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', 'agent-123', ''),
    new Errors().missingPrivateJwk()
  )
})
