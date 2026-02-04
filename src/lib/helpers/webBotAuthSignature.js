const crypto = require('crypto')
const privateJwkObject = require('./privateJwkObject')
const authorityMessage = require('./authorityMessage')

function webBotAuthSignature (method = 'GET', uri = '', signatureParams, privateJwk) {
  const message = authorityMessage(uri, signatureParams)

  // const message = [
  //   `"@method": ${method.toUpperCase()}`,
  //   `"@target-uri": ${uri}`,
  //   `"@signature-params": ${signatureParams}`
  // ].join('\n')

  return crypto.sign(
    null,
    Buffer.from(message, 'utf8'),
    privateJwkObject(privateJwk)
  ).toString('base64')
}

module.exports = webBotAuthSignature
