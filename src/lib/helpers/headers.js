const Errors = require('./errors')
const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')

async function headers (httpMethod, uri, id, privateJwk, tag = 'web-bot-auth', nonce = null) {
  if (!id) throw new Errors().missingId()
  if (!privateJwk) throw new Errors().missingPrivateKey()

  let parsedPrivateJwk
  try {
    parsedPrivateJwk = JSON.parse(privateJwk)
  } catch {
    throw new Errors().invalidPrivateKey()
  }
  if (!parsedPrivateJwk || typeof parsedPrivateJwk !== 'object') {
    throw new Errors().invalidPrivateKey()
  }

  const kid = thumbprint(parsedPrivateJwk)
  parsedPrivateJwk.kid = kid

  // // theirs
  // const request = new Request(uri)
  // const now = new Date()
  // return await signatureHeaders(
  //   request,
  //   await signerFromJWK(JSON.parse(privateJwk)),
  //   {
  //     created: now,
  //     expires: new Date(now.getTime() + 300_000), // now + 5 min
  //   }
  // )

  const signatureInput = signatureParams(parsedPrivateJwk.kid, tag, nonce)
  const signature = webBotAuthSignature(httpMethod, uri, signatureInput, parsedPrivateJwk)
  const signatureAgent = `https://${id}.agents.vestauth.com` // https://agent-1234.agents.vestauth.com/.well-known/http-message-signatures-directory

  return {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
    'Signature-Agent': `sig1=${signatureAgent}`
  }
}

module.exports = headers
