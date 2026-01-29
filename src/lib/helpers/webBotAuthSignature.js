const crypto = require('crypto')
const edPrivateKeyObject = require('./edPrivateKeyObject')

function webBotAuthSignature (method = 'GET', uri = '', signatureParams, privateKey) {
  const u = new URL(uri)
  const authority = u.host // includes port if present

  const message = [
    `"@authority": ${authority}`,
    `"@signature-params": ${signatureParams}`
  ].join('\n')

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
