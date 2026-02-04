const t = require('tap')

const verifyAgentFqdn = require('../../../src/lib/helpers/verifyAgentFqdn')

t.test('#verifyAgentFqdn - valid fqdn', async t => {
  t.equal(verifyAgentFqdn('agent-123.agents.vestauth.com'), true)
})

t.test('#verifyAgentFqdn - scheme not allowed', async t => {
  t.throws(
    () => verifyAgentFqdn('http://agent-123.agents.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})

t.test('#verifyAgentFqdn - path not allowed', async t => {
  t.throws(
    () => verifyAgentFqdn('agent-123.agents.vestauth.com/.well-known'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})

t.test('#verifyAgentFqdn - wrong domain', async t => {
  t.throws(
    () => verifyAgentFqdn('agent-123.example.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})

t.test('#verifyAgentFqdn - non-string', async t => {
  t.throws(
    () => verifyAgentFqdn(null),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})

t.test('#verifyAgentFqdn - env override', async t => {
  const original = process.env.PROVIDER_FQDN_REGEX
  process.env.PROVIDER_FQDN_REGEX = '^custom-[A-Za-z0-9-]+\\.agents\\.vestauth\\.com$'

  t.equal(verifyAgentFqdn('custom-abc.agents.vestauth.com'), true)
  t.throws(
    () => verifyAgentFqdn('agent-123.agents.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )

  if (original === undefined) {
    delete process.env.PROVIDER_FQDN_REGEX
  } else {
    process.env.PROVIDER_FQDN_REGEX = original
  }
})
