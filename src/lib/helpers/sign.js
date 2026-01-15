// import { sign, verify, getPublicKey } from '@noble/secp256k1'
const hashf = require('./hash')

// // privateKey: 32-byte Uint8Array (or hex depending on your setup)
// const signature = await sign(hash, privateKey, { der: false })
//
// // publicKey (compressed): Uint8Array
// const publicKey = getPublicKey(privateKey, true)
//
// // verifier side (server or client)
// const ok = verify(signature, hash, publicKey)

function sign () {
  const message = 'hello'
  const hash = hashf(message)

  return {
    message,
    hash
  }
}

module.exports = sign
