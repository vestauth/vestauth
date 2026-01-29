const crypto = require('crypto')

const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const stripDictionaryKey = require('./stripDictionaryKey')
const authorityMessage = require('./authorityMessage')
const edPublicKeyObject = require('./edPublicKeyObject')
const epoch = require('./epoch')

function providerVerify (httpMetod, uri, signatureHeader, signatureInputHeader, publicKey) {
  const { values } = parseSignatureInputHeader(signatureInputHeader)

  // return early false, since expired
  if (values.expires && values.expires < epoch(new Date())) {
    return {
      success: false
    }
  }

  const signatureParams = stripDictionaryKey(signatureInputHeader)
  const signature = stripDictionaryKey(signatureHeader)
  const message = authorityMessage(uri, signatureParams)
  const publicKeyObject = edPublicKeyObject(publicKey)

  const success = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicKeyObject,
    Buffer.from(signature, 'base64')
  )

  return {
    success
  }
}

module.exports = providerVerify
