const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')

async function headers (httpMethod, uri, privateKeyString, tag = 'vestauth', nonce = null) {
  const privateKey = JSON.parse(privateKeyString)
  const kid = thumbprint(privateKey)
  privateKey.kid = kid

  const signature = signatureParams(privateKey.kid, tag, nonce)
  const sig1 = webBotAuthSignature(httpMethod, uri, signature, privateKey)

  return {
    Signature: `sig1=:${sig1}:`,
    'Signature-Input': `sig1=${signature}`
  }
}

module.exports = headers
