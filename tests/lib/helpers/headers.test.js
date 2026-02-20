const t = require('tap')

const Errors = require('../../../src/lib/helpers/errors')
const headers = require('../../../src/lib/helpers/headers')
const keypair = require('../../../src/lib/helpers/keypair')
const { signatureHeaders } = require('web-bot-auth')
const { signerFromJWK } = require('web-bot-auth/crypto')
const { Request } = require('undici')

t.beforeEach(() => {
  delete process.env.AGENT_HOSTNAME
})

t.afterEach(() => {
  delete process.env.AGENT_HOSTNAME
})

t.test('#headers - deterministic signature input and format', async t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await headers('GET', 'https://example.com/resource', 'agent-123', privateJwkString, undefined, 'nonce-123')

  t.type(result, 'object')
  t.equal(Object.keys(result).length, 3)
  t.ok(result.Signature, 'Signature header exists')
  t.ok(result['Signature-Input'], 'Signature-Input header exists')
  t.equal(result['Signature-Agent'], 'sig1="https://agent-123.api.vestauth.com"')
  t.match(result.Signature, /^sig1=:[A-Za-z0-9+/=]+:$/)
  t.equal(
    result['Signature-Input'],
    'sig1=("@authority");' +
      'created=1700000000;' +
      `keyid="${privateJwk.kid}";` +
      'alg="ed25519";' +
      'expires=1700000300;' +
      'nonce="nonce-123";' +
      'tag="web-bot-auth"'
  )

  Date.now = originalNow
})

t.test('#headers - matches web-bot-auth signatureHeaders', async t => {
  const originalNow = Date.now
  Date.now = () => 1700000000000

  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)
  const nonce = Buffer.alloc(64).toString('base64')

  const ours = await headers(
    'GET',
    'https://example.com/resource',
    'agent-123',
    privateJwkString,
    undefined,
    nonce
  )

  const request = new Request('https://example.com/resource', { method: 'GET' })
  const now = new Date(Date.now())
  const signer = await signerFromJWK(JSON.parse(privateJwkString))
  const theirs = await signatureHeaders(
    request,
    signer,
    {
      created: now,
      expires: new Date(now.getTime() + 300_000),
      nonce,
      tag: 'web-bot-auth'
    }
  )

  t.equal(ours.Signature, theirs.Signature)
  t.equal(ours['Signature-Input'], theirs['Signature-Input'])
  t.equal(ours['Signature-Agent'], 'sig1="https://agent-123.api.vestauth.com"')

  Date.now = originalNow
})

t.test('#headers - null privateJwk string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', 'agent-123', null),
    new Errors().missingPrivateJwk()
  )
})

t.test('#headers - empty privateJwk string', async t => {
  await t.rejects(
    headers('GET', 'https://example.com/resource', 'agent-123', ''),
    new Errors().missingPrivateJwk()
  )
})

t.test('#headers - derives Signature-Agent domain from AGENT_HOSTNAME', async t => {
  process.env.AGENT_HOSTNAME = 'api.example.internal'
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await headers('GET', 'https://example.com/resource', 'agent-123', privateJwkString)

  t.equal(result['Signature-Agent'], 'sig1="https://agent-123.api.example.internal"')
})

t.test('#headers - uses explicit hostname when passed', async t => {
  process.env.AGENT_HOSTNAME = 'api.from-env.internal'
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await headers(
    'GET',
    'https://example.com/resource',
    'agent-123',
    privateJwkString,
    undefined,
    null,
    'https://api.from-arg.internal'
  )

  t.equal(result['Signature-Agent'], 'sig1="https://agent-123.api.from-arg.internal"')
})

t.test('#headers - uses AGENT_HOSTNAME scheme when set to http', async t => {
  process.env.AGENT_HOSTNAME = 'http://localhost:3000'
  const { privateJwk } = keypair()
  const privateJwkString = JSON.stringify(privateJwk)

  const result = await headers('GET', 'https://example.com/resource', 'agent-123', privateJwkString)

  t.equal(result['Signature-Agent'], 'sig1="http://agent-123.localhost:3000"')
})
