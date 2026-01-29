const crypto = require('crypto')

function edPublicKeyObject (keyJson) {
  return crypto.createPublicKey({ key: keyJson, format: 'jwk' })
}

module.exports = edPublicKeyObject
