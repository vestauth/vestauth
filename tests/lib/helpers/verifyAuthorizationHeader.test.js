const t = require('tap')
const secp = require('@noble/secp256k1')
const sign = require('../../../src/lib/helpers/sign')
const verifyAuthorizationHeader = require('../../../src/lib/helpers/verifyAuthorizationHeader')

t.test('#verifyAuthorizationHeader', async t => {
  const challenge = 'hello'
  const privateKeyHex = '1'.repeat(64)
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')

  const publicKeyHex = Buffer
    .from(secp.getPublicKey(privateKeyBytes, true))
    .toString('hex')

  const signature = await sign(challenge, privateKeyHex)

  const header = `${publicKeyHex}:${signature}`

  const ok = await verifyAuthorizationHeader(challenge, header)
  t.equal(ok, true, 'verifies valid signature')

  // negative case: wrong challenge
  const bad = await verifyAuthorizationHeader('nope', header)
  t.equal(bad, false, 'fails for wrong challenge')
})

t.test('#verifyAuthorizationHeader with formatted privateKeyHex', async t => {
  const challenge = 'hello'
  const privateKeyHex = '1'.repeat(64)
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex')

  const publicKeyHex = Buffer
    .from(secp.getPublicKey(privateKeyBytes, true))
    .toString('hex')
  const publicKeyHexFormatted = `agent_pub_${publicKeyHex}`

  const signature = await sign(challenge, privateKeyHex)

  const header = `${publicKeyHexFormatted}:${signature}`

  const ok = await verifyAuthorizationHeader(challenge, header)
  t.equal(ok, true, 'verifies valid signature')

  // negative case: wrong challenge
  const bad = await verifyAuthorizationHeader('nope', header)
  t.equal(bad, false, 'fails for wrong challenge')
})
