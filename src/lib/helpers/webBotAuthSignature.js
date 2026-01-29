const crypto = require('crypto')
const edPrivateKeyObject = require('./edPrivateKeyObject')
const authorityMessage = require('./authorityMessage')

function webBotAuthSignature (method = 'GET', uri = '', signatureParams, privateKey) {
  const message = authorityMessage(uri, signatureParams)

  // const message = [
  //   `"@method": ${method.toUpperCase()}`,
  //   `"@target-uri": ${uri}`,
  //   `"@signature-params": ${signatureParams}`
  // ].join('\n')

  const privateKeyObject = edPrivateKeyObject(privateKey)

  return crypto.sign(
    null,
    Buffer.from(message, 'utf8'),
    privateKeyObject
  ).toString('base64')
}

module.exports = webBotAuthSignature
