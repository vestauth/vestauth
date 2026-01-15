// import { sign, verify, getPublicKey } from '@noble/secp256k1'
const secp = require('@noble/secp256k1')
const { sha256 } = require('@noble/hashes/sha2.js')
const { hmac } = require('@noble/hashes/hmac.js')
secp.hashes.sha256 = sha256
secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg)
const hash = require('./hash')

// // publicKey (compressed): Uint8Array
// const publicKey = getPublicKey(privateKey, true)
//
// // verifier side (server or client)
// const ok = verify(signature, hash, publicKey)

function sign (message, privateKey) {
  const hashMessage = hash(message)
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')
  const signature = secp.sign(hashMessage, privateKeyBytes)

  return Buffer.from(signature).toString('base64url') // base64 returned
}

module.exports = sign
