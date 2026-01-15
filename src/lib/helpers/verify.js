// import { sign, verify, getPublicKey } from '@noble/secp256k1'
// // publicKey (compressed): Uint8Array
// const publicKey = getPublicKey(privateKey, true)
//
// // verifier side (server or client)
// const ok = verify(signature, hash, publicKey)

function verify () {
  console.log('verify todo')
  // const hashMessage = hash(message)
  // const hashPrivateKey = hash(privateKey)
  // const signature = secp.sign(hashMessage, hashPrivateKey)

  // return Buffer.from(signature).toString('base64url') // base64 returned
}

module.exports = verify
