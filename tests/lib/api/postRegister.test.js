const t = require('tap')
t.jobs = 1

const postRegisterPath = require.resolve('../../../src/lib/api/postRegister')
const httpPath = require.resolve('../../../src/lib/helpers/http')
const agentHeadersPath = require.resolve('../../../src/lib/helpers/agentHeaders')

let originalHttpModule
let originalAgentHeadersModule

t.beforeEach(() => {
  originalHttpModule = require.cache[httpPath]
  originalAgentHeadersModule = require.cache[agentHeadersPath]
  delete require.cache[postRegisterPath]
})

t.afterEach(() => {
  if (originalHttpModule) require.cache[httpPath] = originalHttpModule
  else delete require.cache[httpPath]

  if (originalAgentHeadersModule) require.cache[agentHeadersPath] = originalAgentHeadersModule
  else delete require.cache[agentHeadersPath]

  delete require.cache[postRegisterPath]
})

t.test('PostRegister composes register URL from origin without double scheme', async t => {
  const httpCalls = []
  const agentHeaderCalls = []

  require.cache[httpPath] = {
    exports: {
      http: async (url, opts) => {
        httpCalls.push({ url, opts })
        return {
          statusCode: 200,
          body: {
            json: async () => ({ uid: 'agent-123' })
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

  const PostRegister = require('../../../src/lib/api/postRegister')
  const postRegister = new PostRegister(
    'https://api.example.com',
    { kty: 'OKP', crv: 'Ed25519', x: 'abc' },
    { kty: 'OKP', crv: 'Ed25519', d: 'def', x: 'abc' }
  )

  await postRegister.run()

  t.equal(httpCalls.length, 1)
  t.equal(httpCalls[0].url, 'https://api.example.com/register')
  t.notMatch(httpCalls[0].url, /^https:\/\/https:\/\//)

  t.equal(agentHeaderCalls.length, 1)
  t.equal(agentHeaderCalls[0][1], 'https://api.example.com/register')
})
