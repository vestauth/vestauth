const t = require('tap')
t.jobs = 1

const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')
const webBotAuthSignature = require('../../../src/lib/helpers/webBotAuthSignature')
const { verify: webBotAuthVerify } = require('web-bot-auth')
const { verifierFromJWK } = require('web-bot-auth/crypto')
const { Request } = require('undici')

const httpPath = require.resolve('../../../src/lib/helpers/http')
const verifyPath = require.resolve('../../../src/lib/helpers/verify')

function mockHttp (responseJson) {
  const original = require.cache[httpPath]
  require.cache[httpPath] = {
    exports: {
      http: async () => ({
        statusCode: 200,
        body: { json: async () => responseJson }
      })
    }
  }
  delete require.cache[verifyPath]

  return {
    restore: () => {
      if (original) {
        require.cache[httpPath] = original
      } else {
        delete require.cache[httpPath]
      }
      delete require.cache[verifyPath]
    }
  }
}

const verify = require('../../../src/lib/helpers/verify')

t.test('#verify - valid signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const output = await verify('GET', uri, signedHeaders, publicJwk)

  t.same(output.public_jwk, publicJwk)
  t.equal(output.kid, publicJwk.kid)
})

t.test('#verify - matches web-bot-auth verify (valid signature)', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const nonce = Buffer.alloc(64).toString('base64')
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk), undefined, nonce)

  await verify('GET', uri, signedHeaders, publicJwk)

  const request = new Request(uri, {
    method: 'GET',
    headers: {
      Signature: signedHeaders.Signature,
      'Signature-Input': signedHeaders['Signature-Input']
    }
  })
  await webBotAuthVerify(request, await verifierFromJWK(publicJwk))
})

t.test('#verify - invalid signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const match = signedHeaders.Signature.match(/^sig1=:(.*):$/)
  const sig = match ? match[1] : ''
  const tampered = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)

  await t.rejects(
    verify('GET', uri, {
      ...signedHeaders,
      Signature: `sig1=:${tampered}:`
    }, publicJwk),
    { code: 'INVALID_SIGNATURE' }
  )
})

t.test('#verify - matches web-bot-auth verify (invalid signature)', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const nonce = Buffer.alloc(64).toString('base64')
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk), undefined, nonce)

  const match = signedHeaders.Signature.match(/^sig1=:(.*):$/)
  const sig = match ? match[1] : ''
  const tampered = (sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)
  const tamperedHeaders = {
    ...signedHeaders,
    Signature: `sig1=:${tampered}:`
  }

  await t.rejects(
    verify('GET', uri, tamperedHeaders, publicJwk),
    { code: 'INVALID_SIGNATURE' }
  )

  const request = new Request(uri, {
    method: 'GET',
    headers: {
      Signature: tamperedHeaders.Signature,
      'Signature-Input': tamperedHeaders['Signature-Input']
    }
  })
  await t.rejects(
    webBotAuthVerify(request, await verifierFromJWK(publicJwk))
  )
})

t.test('#verify - expired signature', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signatureInput = '("@authority");created=1;keyid="' + publicJwk.kid + '";alg="ed25519";expires=2;nonce="n";tag="web-bot-auth"'
  const signature = webBotAuthSignature('GET', uri, signatureInput, privateJwk)

  await t.rejects(
    verify('GET', uri, {
      Signature: `sig1=:${signature}:`,
      'Signature-Input': `sig1=${signatureInput}`
    }, publicJwk),
    { code: 'EXPIRED_SIGNATURE' }
  )
})

t.test('#verify - selects correct kid from multiple keys in well-known list', async t => {
  const { publicJwk, privateJwk } = keypair()
  const { publicJwk: otherPublicJwk } = keypair()

  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const httpMock = mockHttp({ keys: [otherPublicJwk, publicJwk] })
  t.teardown(httpMock.restore)

  const verifyFn = require('../../../src/lib/helpers/verify')
  const output = await verifyFn('GET', uri, signedHeaders)

  t.equal(output.uid, 'agent-123')
  t.equal(output.kid, publicJwk.kid)
  t.same(output.public_jwk, publicJwk)
})

t.test('#verify - throws invalidSignature when kid not found in well-known list', async t => {
  const { publicJwk, privateJwk } = keypair()
  const { publicJwk: otherPublicJwk } = keypair()

  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const httpMock = mockHttp({ keys: [otherPublicJwk] })
  t.teardown(httpMock.restore)

  const verifyFn = require('../../../src/lib/helpers/verify')
  await t.rejects(
    verifyFn('GET', uri, signedHeaders),
    { code: 'INVALID_SIGNATURE' }
  )
})
