const t = require('tap')
t.jobs = 1

const toolIdentityPath = require.resolve('../../../src/lib/helpers/toolIdentity')
const envPath = require.resolve('../../../src/lib/helpers/env')
let originalEnvModule

function mockEnv (values) {
  require.cache[envPath] = {
    exports: (key) => values[key] || null
  }

  delete require.cache[toolIdentityPath]
}

t.beforeEach(() => {
  originalEnvModule = require.cache[envPath]
  delete require.cache[toolIdentityPath]
})

t.afterEach(() => {
  if (originalEnvModule) require.cache[envPath] = originalEnvModule
  else delete require.cache[envPath]
  delete require.cache[toolIdentityPath]
})

t.test('toolIdentity returns uid and keys', async t => {
  mockEnv({
    TOOL_UID: 'tool-123',
    TOOL_PUBLIC_JWK: '{"kty":"OKP"}',
    TOOL_PRIVATE_JWK: '{"kty":"OKP","d":"abc"}'
  })

  const toolIdentity = require('../../../src/lib/helpers/toolIdentity')
  const result = toolIdentity()

  t.equal(result.uid, 'tool-123')
  t.equal(result.publicJwk, '{"kty":"OKP"}')
  t.equal(result.privateJwk, '{"kty":"OKP","d":"abc"}')
})

t.test('toolIdentity raises when uid exists but keys are incomplete', async t => {
  mockEnv({
    TOOL_UID: 'tool-123',
    TOOL_PUBLIC_JWK: null,
    TOOL_PRIVATE_JWK: '{"kty":"OKP","d":"abc"}'
  })

  const toolIdentity = require('../../../src/lib/helpers/toolIdentity')
  t.throws(() => toolIdentity(), /missing TOOL_PUBLIC_JWK, TOOL_PRIVATE_JWK, or TOOL_UID/)
})
