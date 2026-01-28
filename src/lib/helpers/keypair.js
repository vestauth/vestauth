const crypto = require('crypto')

const thumbprint = require('./thumbprint')

function keypair (existingPrivateKey, prefix = 'agent') {
  let publicJwk
  let privateJwk

  if (existingPrivateKey) {


    // example
    // {
    //   "crv": "Ed25519",
    //   "d": "eScKeQcawvvRiBuA_-gWaAP7PZ3UUGPqJv7jks5tFVI",
    //   "x": "MYf21IkWEi6dXOtzUdbll3SMCaFiSFi4KgqktFZinCE",
    //   "kty": "OKP",
    //   "kid": "rBE7_zLOVYk4oYEdI-01qpXHWNMyZYD-4LEf6HiyZ9Q"
    // }
    // (publicKey just removex 'd')

    privateJwk = JSON.parse(existingPrivateKey)
    publicJwk = {
      crv: privateJwk['crv'],
      x: privateJwk['x'],
      kty: privateJwk['kty'],
      kid: privateJwk['kid'],
    }
    kid = thumbprint(publicJwk)
    publicJwk.kid = kid
    privateJwk.kid = kid
  } else {
    const {
      publicKey,
      privateKey
    } = crypto.generateKeyPairSync('ed25519')

    publicJwk = publicKey.export({ format: 'jwk' })
    privateJwk = privateKey.export({ format: 'jwk' })

    kid = thumbprint(publicJwk)
    publicJwk.kid = kid
    privateJwk.kid = kid
  }

  return {
    publicKey: publicJwk,
    privateKey: privateJwk
  }
}

module.exports = keypair
