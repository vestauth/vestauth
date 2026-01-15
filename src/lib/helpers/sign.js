// import { sign, verify, getPublicKey } from '@noble/secp256k1'
const secp = require('@noble/secp256k1')
const { sha256 } = require('@noble/hashes/sha2.js')
const { hmac } = require('@noble/hashes/hmac.js')
secp.hashes.sha256 = sha256
secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg)
const hash = require('./hash')

function sign (challenge, privateKeyHex) {
  const hashChallenge = hash(challenge)
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')
  const signature = secp.sign(hashChallenge, privateKeyBytes)

  return Buffer.from(signature).toString('base64url') // base64 returned
}

module.exports = sign
