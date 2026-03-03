const t = require('tap')
t.jobs = 1

const postToolRegisterPath = require.resolve('../../../src/lib/api/postToolRegister')
const httpPath = require.resolve('../../../src/lib/helpers/http')
const agentHeadersPath = require.resolve('../../../src/lib/helpers/agentHeaders')

let originalHttpModule
let originalAgentHeadersModule

t.beforeEach(() => {
  originalHttpModule = require.cache[httpPath]
  originalAgentHeadersModule = require.cache[agentHeadersPath]
  delete require.cache[postToolRegisterPath]
})

t.afterEach(() => {
  if (originalHttpModule) require.cache[httpPath] = originalHttpModule
  else delete require.cache[httpPath]

  if (originalAgentHeadersModule) require.cache[agentHeadersPath] = originalAgentHeadersModule
  else delete require.cache[agentHeadersPath]

  delete require.cache[postToolRegisterPath]
})

t.test('PostToolRegister composes register URL from origin without double scheme', async t => {
  const httpCalls = []
  const agentHeaderCalls = []

  require.cache[httpPath] = {
    exports: {
      http: async (url, opts) => {
        httpCalls.push({ url, opts })
        return {
          statusCode: 200,
          body: {
            json: async () => ({ uid: 'tool-123' })
          }
        }
      }
    }
  }

  require.cache[agentHeadersPath] = {
    exports: async (...args) => {
      agentHeaderCalls.push(args)
      return {
        Signature: 'sig1=:abc:',
        'Signature-Input': 'sig1=("@authority");created=1;expires=2',
        'Signature-Agent': 'sig1=REGISTERING.api.example.com'
      }
    }
  }

  const PostToolRegister = require('../../../src/lib/api/postToolRegister')
  const postToolRegister = new PostToolRegister(
    'https://api.example.com',
    { kty: 'OKP', crv: 'Ed25519', x: 'abc' },
    { kty: 'OKP', crv: 'Ed25519', d: 'def', x: 'abc' }
  )

  await postToolRegister.run()

  t.equal(httpCalls.length, 1)
  t.equal(httpCalls[0].url, 'https://api.example.com/tool/register')
  t.notMatch(httpCalls[0].url, /^https:\/\/https:\/\//)

  t.equal(agentHeaderCalls.length, 1)
  t.equal(agentHeaderCalls[0][1], 'https://api.example.com/tool/register')
})
