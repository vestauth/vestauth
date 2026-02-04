const { verify } = require('web-bot-auth')
const { verifierFromJWK } = require('web-bot-auth/crypto')

async function verifyWebBotAuth (httpMethod, uri, signatureHeader, signatureInputHeader, publicKey) {
  let success = false

  const verifier = await verifierFromJWK(publicKey)
  const signedRequest = new Request(uri, {
    headers: {
      Signature: signatureHeader,
      'Signature-Input': signatureInputHeader
    }
  })

  try {
    await verify(signedRequest, verifier)
    success = true
  } catch (_e) {}

  return {
    success
  }
}

module.exports = verifyWebBotAuth
