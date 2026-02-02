const t = require('tap')
const crypto = require('crypto')

const keypair = require('../../../src/lib/helpers/keypair')
const authorityMessage = require('../../../src/lib/helpers/authorityMessage')
const webBotAuthSignature = require('../../../src/lib/helpers/webBotAuthSignature')

t.test('#webBotAuthSignature - valid signature verifies', t => {
  const { publicKey, privateKey } = keypair()
  const uri = 'https://example.com/resource'
  const signatureParams = '("@authority");created=1;keyid="kid";alg="ed25519";expires=2;nonce="n";tag="vestauth"'

  const signature = webBotAuthSignature('GET', uri, signatureParams, privateKey)

  const message = authorityMessage(uri, signatureParams)
  const publicKeyObject = crypto.createPublicKey({ key: publicKey, format: 'jwk' })
  const isValid = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicKeyObject,
    Buffer.from(signature, 'base64')
  )

  t.equal(isValid, true)
  t.end()
})

t.test('#webBotAuthSignature - different params fail verification', t => {
  const { publicKey, privateKey } = keypair()
  const uri = 'https://example.com/resource'
  const signatureParams = '("@authority");created=1;keyid="kid";alg="ed25519";expires=2;nonce="n";tag="vestauth"'

  const signature = webBotAuthSignature('GET', uri, signatureParams, privateKey)

  const message = authorityMessage(uri, signatureParams.replace('nonce="n"', 'nonce="m"'))
  const publicKeyObject = crypto.createPublicKey({ key: publicKey, format: 'jwk' })
  const isValid = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicKeyObject,
    Buffer.from(signature, 'base64')
  )

  t.equal(isValid, false)
  t.end()
})
