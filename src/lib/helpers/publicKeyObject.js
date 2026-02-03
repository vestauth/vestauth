const crypto = require('crypto')

function publicKeyObject (publicJwk) {
  return crypto.createPublicKey({ key: publicJwk, format: 'jwk' })
}

module.exports = publicKeyObject
