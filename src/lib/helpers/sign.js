const secp = require('@noble/secp256k1')
const hash = require('./hash')
const stripFormatting = require('./stripFormatting')

async function sign (challenge, privateKeyHexPossiblyFormatted) {
  const privateKeyHex = stripFormatting(privateKeyHexPossiblyFormatted)
  const hashChallenge = hash(challenge)
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')
  const signature = await secp.sign(hashChallenge, privateKeyBytes)

  return Buffer.from(signature).toString('base64url') // base64 returned
}

module.exports = sign
