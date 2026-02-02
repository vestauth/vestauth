const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')

async function headers (httpMethod, uri, privateKeyString, tag = 'vestauth', nonce = null) {
  if (!privateKeyString) throw new Error('missing privateKey')

  let privateKey
  try {
    privateKey = JSON.parse(privateKeyString)
  } catch (err) {
    throw new Error('invalid privateKey')
  }
  if (!privateKey || typeof privateKey !== 'object') throw new Error('invalid privateKey')

  const kid = thumbprint(privateKey)
  privateKey.kid = kid

  // // theirs
  // const request = new Request(uri)
  // const now = new Date()
  // return await signatureHeaders(
  //   request,
  //   await signerFromJWK(JSON.parse(privateKeyString)),
  //   {
  //     created: now,
  //     expires: new Date(now.getTime() + 300_000), // now + 5 min
  //   }
  // )

  // ours
  const signatureInput = signatureParams(privateKey.kid, tag, nonce)
  const signature = webBotAuthSignature(httpMethod, uri, signatureInput, privateKey)

  return {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`
  }
}

module.exports = headers
