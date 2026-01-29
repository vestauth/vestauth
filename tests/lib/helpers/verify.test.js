// const t = require('tap')
// const secp = require('@noble/secp256k1')
// const sign = require('../../../src/lib/helpers/sign')
// const verify = require('../../../src/lib/helpers/verify')

// t.test('#verify', async t => {
//   const challenge = 'hello'
//   const privateKeyHex = '1'.repeat(64)
//   const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')
//
//   const publicKeyHex = Buffer
//     .from(secp.getPublicKey(privateKeyBytes, true))
//     .toString('hex')
//
//   const signature = await sign(challenge, privateKeyHex)
//
//   const ok = await verify(challenge, signature, publicKeyHex)
//   t.equal(ok, true, 'verifies valid signature')
//
//   // negative case: wrong challenge
//   const bad = await verify('nope', signature, publicKeyHex)
//   t.equal(bad, false, 'fails for wrong challenge')
// })
//
// t.test('#verify with formatted privateKeyHex', async t => {
//   const challenge = 'hello'
//   const privateKeyHex = '1'.repeat(64)
//   const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')
//
//   const publicKeyHex = Buffer
//     .from(secp.getPublicKey(privateKeyBytes, true))
//     .toString('hex')
//   const publicKeyHexFormatted = `agent_pub_${publicKeyHex}`
//
//   const signature = await sign(challenge, privateKeyHex)
//
//   const ok = await verify(challenge, signature, publicKeyHexFormatted)
//   t.equal(ok, true, 'verifies valid signature')
//
//   // negative case: wrong challenge
//   const bad = await verify('nope', signature, publicKeyHex)
//   t.equal(bad, false, 'fails for wrong challenge')
// })
