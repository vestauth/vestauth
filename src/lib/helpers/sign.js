// import { sign, verify, getPublicKey } from '@noble/secp256k1'
const secp = require('@noble/secp256k1')
const { sha256 } = require('@noble/hashes/sha2.js')
const { hmac } = require('@noble/hashes/hmac.js')
secp.hashes.sha256 = sha256
secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg)
const hash = require('./hash')

// // privateKey: 32-byte Uint8Array (or hex depending on your setup)
// const signature = await sign(hash, privateKey, { der: false })
//
// // publicKey (compressed): Uint8Array
// const publicKey = getPublicKey(privateKey, true)
//
// // verifier side (server or client)
// const ok = verify(signature, hash, publicKey)

function sign (message, privateKey) {
  return secp.sign(hash(message), hash(privateKey))
}

module.exports = sign
