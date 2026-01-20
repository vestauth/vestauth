const t = require('tap')
const keypair = require('../../../src/lib/helpers/keypair')
const stripFormatting = require('../../../src/lib/helpers/stripFormatting')
const { PrivateKey } = require('eciesjs')

t.test('#keypair', t => {
  const { publicKey, privateKey } = keypair()

  t.type(publicKey, 'string', 'public key is a string')
  t.type(privateKey, 'string', 'private key is a string')

  t.match(publicKey, /^agent_pub_[0-9a-f]*$/, 'public key starts with agent_pub_')
  t.match(privateKey, /^agent_prv_[0-9a-f]{64}$/, 'private key starts with agent_prv_')

  const strippedPrivateKey = stripFormatting(privateKey)
  const strippedPublicKey = stripFormatting(publicKey)

  // sanity checks
  t.equal(strippedPrivateKey.length, 64, 'private key is 32 bytes hex')
  t.ok(strippedPublicKey.length > 0, 'public key exists')

  // verify public key matches private key
  const kp = new PrivateKey(Buffer.from(strippedPrivateKey, 'hex'))
  t.equal(
    kp.publicKey.toHex(),
    strippedPublicKey,
    'public key matches derived key'
  )

  t.end()
})

t.test('#keypair(provider)', t => {
  const { publicKey, privateKey } = keypair(null, 'provider')

  t.type(publicKey, 'string', 'public key is a string')
  t.type(privateKey, 'string', 'private key is a string')

  t.match(publicKey, /^provider_pub_[0-9a-f]*$/, 'public key starts with provider_pub_')
  t.match(privateKey, /^provider_prv_[0-9a-f]{64}$/, 'private key starts with provider_prv_')

  const strippedPrivateKey = stripFormatting(privateKey)
  const strippedPublicKey = stripFormatting(publicKey)

  // sanity checks
  t.equal(strippedPrivateKey.length, 64, 'private key is 32 bytes hex')
  t.ok(strippedPublicKey.length > 0, 'public key exists')

  // verify public key matches private key
  const kp = new PrivateKey(Buffer.from(strippedPrivateKey, 'hex'))
  t.equal(
    kp.publicKey.toHex(),
    strippedPublicKey,
    'public key matches derived key'
  )

  t.end()
})

t.test('#keypair(none)', t => {
  const { publicKey, privateKey } = keypair(null, 'none')

  t.type(publicKey, 'string', 'public key is a string')
  t.type(privateKey, 'string', 'private key is a string')

  // sanity checks
  t.equal(privateKey.length, 64, 'private key is 32 bytes hex')
  t.ok(publicKey.length > 0, 'public key exists')

  // verify public key matches private key
  const kp = new PrivateKey(Buffer.from(privateKey, 'hex'))
  t.equal(kp.publicKey.toHex(), publicKey, 'public key matches derived key')

  t.end()
})
