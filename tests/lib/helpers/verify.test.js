const t = require('tap')

const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')
const verify = require('../../../src/lib/helpers/verify')
const webBotAuthSignature = require('../../../src/lib/helpers/webBotAuthSignature')

t.test('#verify - valid signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const output = verify('GET', uri, signedHeaders, publicJwk)

  t.equal(output.success, true)
})

t.test('#verify - invalid signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const match = signedHeaders.Signature.match(/^sig1=:(.*):$/)
  const sig = match ? match[1] : ''
  const tampered = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)

  const output = verify('GET', uri, {
    ...signedHeaders,
    Signature: `sig1=:${tampered}:`
  }, publicJwk)

  t.equal(output.success, false)
})

t.test('#verify - expired signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signatureInput = '("@authority");created=1;keyid="' + publicJwk.kid + '";alg="ed25519";expires=2;nonce="n";tag="web-bot-auth"'
  const signature = webBotAuthSignature('GET', uri, signatureInput, privateJwk)

  t.throws(
    () => verify('GET', uri, {
      Signature: `sig1=:${signature}:`,
      'Signature-Input': `sig1=${signatureInput}`
    }, publicJwk),
    { code: 'EXPIRED_SIGNATURE' }
  )
})
