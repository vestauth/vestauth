const crypto = require('crypto')

const thumbprint = require('./thumbprint')

function keypair (existingPrivateJwk, prefix = 'agent') {
  let publicJwk
  let privateJwk

  if (existingPrivateJwk) {
    // example
    // {
    //   "crv": "Ed25519",
    //   "d": "eScKeQcawvvRiBuA_-gWaAP7PZ3UUGPqJv7jks5tFVI",
    //   "x": "MYf21IkWEi6dXOtzUdbll3SMCaFiSFi4KgqktFZinCE",
    //   "kty": "OKP",
    //   "kid": "rBE7_zLOVYk4oYEdI-01qpXHWNMyZYD-4LEf6HiyZ9Q"
    // }
    // (publicJwk just remove 'd')

    privateJwk = JSON.parse(existingPrivateJwk)
    publicJwk = {
      crv: privateJwk.crv,
      x: privateJwk.x,
      kty: privateJwk.kty,
      kid: privateJwk.kid
    }
    const kid = thumbprint(publicJwk)
    publicJwk.kid = kid
    privateJwk.kid = kid
  } else {
    const {
      publicKey,
      privateKey
    } = crypto.generateKeyPairSync('ed25519')

    publicJwk = publicKey.export({ format: 'jwk' })
    privateJwk = privateKey.export({ format: 'jwk' })

    const kid = thumbprint(publicJwk)
    publicJwk.kid = kid
    privateJwk.kid = kid
  }

  return {
    publicJwk,
    privateJwk
  }
}

module.exports = keypair
