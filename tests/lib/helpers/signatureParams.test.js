const t = require('tap')

const signatureParams = require('../../../src/lib/helpers/signatureParams')

t.test('#signatureParams - deterministic values', t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const kid = 'did:example:123#key-1'
  const nonce = 'nonce-123'

  const result = signatureParams(kid, undefined, nonce)

  t.equal(
    result,
    '("@authority");' +
      'created=1700000000;' +
      'keyid="did:example:123#key-1";' +
      'alg="ed25519";' +
      'expires=1700000300;' +
      'nonce="nonce-123";' +
      'tag="vestauth"'
  )

  Date.now = originalNow
  t.end()
})
