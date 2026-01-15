const secp = require('@noble/secp256k1')
const hash = require('./hash')

function verify (message, signatureBase64, publicKeyHex) {
  const hashMessage = hash(message)
  const signature = Buffer.from(signatureBase64, 'base64url')
  const publicKeyBytes = Buffer.from(publicKeyHex, 'hex')

  return secp.verify(signature, hashMessage, publicKeyBytes)
}

module.exports = verify
