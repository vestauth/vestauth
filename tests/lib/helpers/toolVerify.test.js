const t = require('tap')
t.jobs = 1

const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')

const httpPath = require.resolve('../../../src/lib/helpers/http')
const toolPath = require.resolve('../../../src/lib/helpers/toolVerify')
const verifyPath = require.resolve('../../../src/lib/helpers/verify')

function mockHttp (responseJson) {
  const calls = []
  const mock = async () => ({
    statusCode: 200,
    body: {
      json: async () => responseJson
    }
  })

  const mockWithCapture = async (url, opts) => {
    calls.push({ url, opts })
    return mock(url, opts)
  }

  const original = require.cache[httpPath]
  require.cache[httpPath] = { exports: { http: mockWithCapture } }

  return {
    calls,
    restore: () => {
      if (original) {
        require.cache[httpPath] = original
      } else {
        delete require.cache[httpPath]
      }
      delete require.cache[toolPath]
      delete require.cache[verifyPath]
    }
  }
}

t.test('#toolVerify - returns agent info', async t => {
  const { publicJwk, privateJwk } = keypair()
  const { publicJwk: otherPublicJwk } = keypair()

  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const httpMock = mockHttp({
    keys: [otherPublicJwk, publicJwk]
  })
  t.teardown(httpMock.restore)

  const toolVerify = require('../../../src/lib/helpers/toolVerify')
  const output = await toolVerify('GET', uri, signedHeaders, 'localhost:3000')

  t.equal(output.uid, 'agent-123')
  t.equal(output.kid, publicJwk.kid)
  t.same(output.public_jwk, publicJwk)
  t.equal(
    output.well_known_url,
    'https://agent-123.api.vestauth.com/.well-known/http-message-signatures-directory'
  )
})

t.test('#toolVerify - accepts legacy bare Signature-Agent value', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))
  signedHeaders['Signature-Agent'] = 'sig1=agent-123.api.vestauth.com'

  const httpMock = mockHttp({ keys: [publicJwk] })
  t.teardown(httpMock.restore)

  const toolVerify = require('../../../src/lib/helpers/toolVerify')
  const output = await toolVerify('GET', uri, signedHeaders, 'localhost:3000')

  t.equal(output.uid, 'agent-123')
  t.equal(output.well_known_url, 'https://agent-123.api.vestauth.com/.well-known/http-message-signatures-directory')
  t.equal(httpMock.calls[0].url, 'https://agent-123.api.vestauth.com/.well-known/http-message-signatures-directory')
})

t.test('#toolVerify - accepts Signature-Agent uri with http scheme', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))
  signedHeaders['Signature-Agent'] = 'sig1="http://agent-123.localhost:3000"'

  const httpMock = mockHttp({ keys: [publicJwk] })
  t.teardown(() => {
    httpMock.restore()
  })

  const toolVerify = require('../../../src/lib/helpers/toolVerify')
  const output = await toolVerify('GET', uri, signedHeaders, 'localhost:3000')

  t.equal(output.uid, 'agent-123')
  t.equal(output.well_known_url, 'http://agent-123.localhost:3000/.well-known/http-message-signatures-directory')
  t.equal(httpMock.calls[0].url, 'http://127.0.0.1:3000/.well-known/http-message-signatures-directory')
})

t.test('#toolVerify - sends host header for localhost Signature-Agent', async t => {
  const { publicJwk, privateJwk } = keypair()
  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))
  signedHeaders['Signature-Agent'] = 'sig1="http://agent-123.localhost:3000"'

  const httpMock = mockHttp({ keys: [publicJwk] })
  t.teardown(httpMock.restore)

  const toolVerify = require('../../../src/lib/helpers/toolVerify')
  await toolVerify('GET', uri, signedHeaders, 'localhost:3000')

  t.same(httpMock.calls[0].opts, {
    method: 'GET',
    headers: {
      host: 'agent-123.localhost:3000'
    }
  })
})
