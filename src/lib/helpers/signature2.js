const wba = require('web-bot-auth')
const { signerFromJWK } = require('web-bot-auth/crypto')
const crypto = require('crypto')
const { URL } = require('url')
const edPrivateKeyObject = require('./edPrivateKeyObject')
const thumbprint = require('./thumbprint')

async function signature2 () {
  // inputs
  const RFC_9421_ED25519_TEST_KEY = {
    kty: 'OKP',
    crv: 'Ed25519',
    d: 'n4Ni-HpISpVObnQMW0wOhCKROaIKqKtW_2ZYb2p9KcU',
    x: 'JrQLj5P_89iXES9-vFgrIy29clF9CC_oPPsw3c5D0bs',
  }
  const kid = thumbprint(RFC_9421_ED25519_TEST_KEY)
  RFC_9421_ED25519_TEST_KEY['kid'] = kid

  console.log(`kid: ${kid}`)

  const url = 'https://example.com'
  const now = new Date()
  const created = now
  const expires = new Date(now.getTime() + 300_000) // now + 5 min

  // headers
  const request = new Request(url)
  const headers = await wba.signatureHeaders(request, await signerFromJWK(RFC_9421_ED25519_TEST_KEY), { created, expires })

  // // headers2
  const privateKeyObject = edPrivateKeyObject(RFC_9421_ED25519_TEST_KEY)

  const nonce = crypto.randomBytes(32).toString('base64url')
  const u = new URL(request.url)
  const signatureInput =
    `("@authority");` +
    `created=${Math.floor(created / 1000)};` +
    `keyid="${RFC_9421_ED25519_TEST_KEY.kid}";` +
    `alg="ed25519";` +
    `expires=${Math.floor(expires / 1000)};` +
    `nonce="${nonce}";` +
    `tag="vestauth"`

  const base = [
    `"@method": ${request.method.toUpperCase()}`,
    `"@target-uri": ${u.toString()}`,
    `"@signature-params": ${signatureInput}`,
  ].join('\n')

  const signature = crypto.sign(
    null,
    Buffer.from(base, 'utf8'),
    privateKeyObject
  ).toString('base64')

  const headers2 = {
    'Signature': `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
  }

  return {
    headers: headers,
    headers2: headers2
  }
}

module.exports = signature2
