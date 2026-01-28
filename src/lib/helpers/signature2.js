const crypto = require('crypto')
const { URL } = require('url')
const edPrivateKeyObject = require('./edPrivateKeyObject')
const thumbprint = require('./thumbprint')

async function signature2 (privateKeyString, tag = 'vestauth') {
  const privateKey = JSON.parse(privateKeyString)

  const kid = thumbprint(privateKey)
  privateKey.kid = kid

  console.log(`kid: ${kid}`)

  const url = 'https://example.com'
  const now = new Date()
  const created = now
  const expires = new Date(now.getTime() + 300_000) // now + 5 min

  // headers
  const request = new Request(url)
  const privateKeyObject = edPrivateKeyObject(privateKey)

  const nonce = crypto.randomBytes(64).toString('base64')
  const u = new URL(request.url)
  const signatureInput =
    '("@authority");' +
    `created=${Math.floor(created / 1000)};` +
    `keyid="${privateKey.kid}";` +
    'alg="ed25519";' +
    `expires=${Math.floor(expires / 1000)};` +
    `nonce="${nonce}";` +
    `tag="${tag}"`

  const base = [
    `"@method": ${request.method.toUpperCase()}`,
    `"@target-uri": ${u.toString()}`,
    `"@signature-params": ${signatureInput}`
  ].join('\n')

  const signature = crypto.sign(
    null,
    Buffer.from(base, 'utf8'),
    privateKeyObject
  ).toString('base64')

  const headers = {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`
  }

  return {
    headers
  }
}

module.exports = signature2
