const crypto = require('crypto')

const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const stripDictionaryKey = require('./stripDictionaryKey')
const authorityMessage = require('./authorityMessage')
const publicJwkObject = require('./publicJwkObject')

function verify (httpMethod, uri, headers = {}, publicJwk) {
  const signature = headers.Signature || headers['signature']
  const signatureInput = headers['Signature-Input'] || headers['signature-input']

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
    publicJwkObject(publicJwk),
    Buffer.from(sig, 'base64')
  )

  return {
    success
  }
}

module.exports = verify
