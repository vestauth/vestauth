const crypto = require('crypto')

const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const stripDictionaryKey = require('./stripDictionaryKey')
const authorityMessage = require('./authorityMessage')
const publicKeyObject = require('./publicKeyObject')

function verify (httpMethod, uri, headers = {}, publicJwk) {
  const signature = headers.Signature
  const signatureInput = headers['Signature-Input']
  const signatureAgent = headers['Signature-Agent']

  console.log(signature, signatureInput)

  const { values } = parseSignatureInputHeader(signatureInput)
  const { expires } = values

  // return early false, since expired
  if (expires && expires < (Math.floor(Date.now() / 1000))) {
    return {
      success: false
    }
  }

  const signatureParams = stripDictionaryKey(signatureInput)
  const sig = stripDictionaryKey(signature)
  const message = authorityMessage(uri, signatureParams)

  const success = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicKeyObject(publicJwk),
    Buffer.from(sig, 'base64')
  )

  return {
    success
  }
}

module.exports = verify
