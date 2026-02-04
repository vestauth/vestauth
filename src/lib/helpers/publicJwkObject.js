const crypto = require('crypto')

function publicJwkObject (publicJwk) {
  return crypto.createPublicKey({ key: publicJwk, format: 'jwk' })
}

module.exports = publicJwkObject
