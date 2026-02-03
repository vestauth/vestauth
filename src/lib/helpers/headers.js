const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')

async function headers (httpMethod, uri, privateKeyString, uid, tag = 'vestauth', nonce = null) {
  if (!privateKeyString) throw new Error('missing privateKey')
  if (!uid) throw new Error('missing uid')

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
  const signatureAgent = `https://${uid}.agents.vestauth.com` // https://agent-2028e360a7f4ec28bc3cb7e6.agents.vestauth.com/.well-known/http-message-signatures-directory

  return {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
    'Signature-Agent': `sig1=${signatureAgent}`
  }
}

module.exports = headers
