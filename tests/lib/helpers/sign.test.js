const t = require('tap')
const secp = require('@noble/secp256k1')
const sign = require('../../../src/lib/helpers/sign')
const hash = require('../../../src/lib/helpers/hash')

t.test('#sign', async t => {
  const challenge = 'hello'
  const privateKeyHex = '1'.repeat(64) // 32 bytes hex (not secure; fine for tests)

  const sigB64Url = await sign(challenge, privateKeyHex)

  t.type(sigB64Url, 'string')
  t.match(sigB64Url, /^[A-Za-z0-9_-]+$/)

  // verify it
  const msgHash = hash(challenge)
  const sigBytes = Buffer.from(sigB64Url, 'base64url')

  const pubKey = secp.getPublicKey(Buffer.from(privateKeyHex, 'hex'), true) // compressed
  const ok = await secp.verify(sigBytes, msgHash, pubKey)

  t.equal(ok, true, 'signature verifies with derived public key')
})

t.test('#sign with formatted privateKeyHex', async t => {
  const challenge = 'hello'
  const privateKeyHex = '1'.repeat(64) // 32 bytes hex (not secure; fine for tests)
  const privateKeyHexFormatted = `agent_prv_${privateKeyHex}`

  const sigB64Url = await sign(challenge, privateKeyHexFormatted)

  t.type(sigB64Url, 'string')
  t.match(sigB64Url, /^[A-Za-z0-9_-]+$/)

  // verify it
  const msgHash = hash(challenge)
  const sigBytes = Buffer.from(sigB64Url, 'base64url')

  const pubKey = secp.getPublicKey(Buffer.from(privateKeyHex, 'hex'), true) // compressed
  const ok = await secp.verify(sigBytes, msgHash, pubKey)

  t.equal(ok, true, 'signature verifies with derived public key')
})
