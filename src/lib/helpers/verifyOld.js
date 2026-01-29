const secp = require('@noble/secp256k1')
const hash = require('./hash')
const stripFormatting = require('./stripFormatting')

function verifyOld (challenge, signatureBase64, publicKeyHexPossiblyFormatted) {
  const publicKeyHex = stripFormatting(publicKeyHexPossiblyFormatted)
  const hashChallenge = hash(challenge)
  const signature = Buffer.from(signatureBase64, 'base64url')
  const publicKeyBytes = Buffer.from(publicKeyHex, 'hex')

  return secp.verify(signature, hashChallenge, publicKeyBytes)
}

module.exports = verifyOld
