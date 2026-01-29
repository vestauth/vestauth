const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')

// const { signatureHeaders } = require('web-bot-auth')
// const { signerFromJWK } = require('web-bot-auth/crypto')

async function headers (httpMethod, uri, privateKeyString, tag = 'vestauth', nonce = null) {
  // shared
  const privateKey = JSON.parse(privateKeyString)
  const kid = thumbprint(privateKey)
  privateKey.kid = kid

  // // theirs
  // const request = new Request(uri)
  // const now = new Date()
  // const headersTheirs = await signatureHeaders(
  //   request,
  //   await signerFromJWK(JSON.parse(privateKeyString)),
  //   {
  //     created: now,
  //     expires: new Date(now.getTime() + 300_000), // now + 5 min
  //   }
  // )

  // ours
  const signature = signatureParams(privateKey.kid, tag, nonce)
  const sig1 = webBotAuthSignature(httpMethod, uri, signature, privateKey)

  const headersOurs = {
    Signature: `sig1=:${sig1}:`,
    'Signature-Input': `sig1=${signature}`
  }

  return headersOurs
}

module.exports = headers
