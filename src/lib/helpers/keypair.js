const { PrivateKey } = require('eciesjs')

function keypair (existingPrivateKey, prefix = 'agent') {
  let kp

  if (existingPrivateKey) {
    kp = new PrivateKey(Buffer.from(existingPrivateKey, 'hex'))
  } else {
    kp = new PrivateKey()
  }

  let publicKey = kp.publicKey.toHex()
  let privateKey = kp.secret.toString('hex')

  if (prefix === 'agent') {
    publicKey = `agent_pub_${publicKey}`
    privateKey = `agent_prv_${privateKey}`
  }

  if (prefix === 'provider') {
    publicKey = `provider_pub_${publicKey}`
    privateKey = `provider_prv_${privateKey}`
  }

  return {
    publicKey,
    privateKey
  }
}

module.exports = keypair
