const crypto = require('crypto')

const thumbprint = require('./thumbprint')

function keypair2 () {
  const {
    publicKey,
    privateKey
  } = crypto.generateKeyPairSync('ed25519')

  const publicJwk = publicKey.export({ format: 'jwk' })
  const privateJwk = privateKey.export({ format: 'jwk' })
  const kid = thumbprint(publicJwk)

  publicJwk['kid'] = kid
  privateJwk['kid'] = kid

  // let kp

  // if (existingPrivateKey) {
  //   const existingPrivateKeyStripped = stripFormatting(existingPrivateKey)
  //   kp = new PrivateKey(Buffer.from(existingPrivateKeyStripped, 'hex'))
  // } else {
  //   kp = new PrivateKey()
  // }

  // let publicKey = kp.publicKey.toHex()
  // let privateKey = kp.secret.toString('hex')

  // if (prefix === 'agent') {
  //   publicKey = `agent_pub_${publicKey}`
  //   privateKey = `agent_prv_${privateKey}`
  // }

  // if (prefix === 'provider') {
  //   publicKey = `provider_pub_${publicKey}`
  //   privateKey = `provider_prv_${privateKey}`
  // }

  return {
    publicKey: publicJwk,
    privateKey: privateJwk
  }
}

module.exports = keypair2
