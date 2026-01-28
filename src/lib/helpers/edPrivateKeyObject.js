const crypto = require('crypto')

function edPrivateKeyObject (keyJson) {
  return crypto.createPrivateKey({ key: keyJson, format: 'jwk' })
}

module.exports = edPrivateKeyObject
