const t = require('tap')

const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')

const httpPath = require.resolve('../../../src/lib/helpers/http')
const toolPath = require.resolve('../../../src/lib/helpers/toolVerify')

function mockHttp (responseJson) {
  const mock = async () => ({
    statusCode: 200,
    body: {
      json: async () => responseJson
    }
  })

  const original = require.cache[httpPath]
  require.cache[httpPath] = { exports: { http: mock } }

  return () => {
    if (original) {
      require.cache[httpPath] = original
    } else {
      delete require.cache[httpPath]
    }
    delete require.cache[toolPath]
  }
}

t.test('#toolVerify - returns agent info', async t => {
  const { publicJwk, privateJwk } = keypair()
  const { publicJwk: otherPublicJwk } = keypair()

  const uri = 'https://example.com/resource'
  const signedHeaders = await headers('GET', uri, 'agent-123', JSON.stringify(privateJwk))

  const restore = mockHttp({
    keys: [otherPublicJwk, publicJwk]
  })
  t.teardown(restore)

  const toolVerify = require('../../../src/lib/helpers/toolVerify')
  const output = await toolVerify('GET', uri, signedHeaders)

  t.equal(output.uid, 'agent-123')
  t.equal(output.kid, publicJwk.kid)
  t.same(output.public_jwk, publicJwk)
  t.equal(
    output.well_known_url,
    'https://agent-123.api.vestauth.com/.well-known/http-message-signatures-directory'
  )
})
