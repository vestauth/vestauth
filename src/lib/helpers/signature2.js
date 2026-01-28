const crypto = require('crypto')
const { URL } = require('url')
const edPrivateKeyObject = require('./edPrivateKeyObject')
const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')

async function signature2 (privateKeyString, tag = 'vestauth') {
  const privateKey = JSON.parse(privateKeyString)

  const kid = thumbprint(privateKey)
  privateKey.kid = kid

  const url = 'https://example.com'
  const now = new Date()
  const created = now
  const expires = new Date(now.getTime() + 300_000) // now + 5 min

  // headers
  const request = new Request(url)
  const privateKeyObject = edPrivateKeyObject(privateKey)

  const u = new URL(request.url)

  const _sigParams = signatureParams(privateKey.kid, tag)

  const base = [
    `"@method": ${request.method.toUpperCase()}`,
    `"@target-uri": ${u.toString()}`,
    `"@signature-params": ${_sigParams}`
  ].join('\n')

  const signature = crypto.sign(
    null,
    Buffer.from(base, 'utf8'),
    privateKeyObject
  ).toString('base64')

  const headers = {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${_sigParams}`
  }

  return {
    headers
  }
}

module.exports = signature2
