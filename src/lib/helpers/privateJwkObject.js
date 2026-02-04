const crypto = require('crypto')

function privateJwkObject (privateJwk) {
  return crypto.createPrivateKey({ key: privateJwk, format: 'jwk' })
}

module.exports = privateJwkObject
