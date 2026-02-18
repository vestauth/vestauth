const t = require('tap')

const verifyAgentFqdn = require('../../../src/lib/helpers/verifyAgentFqdn')

t.test('#verifyAgentFqdn - valid fqdn', async t => {
  t.equal(verifyAgentFqdn('agent-123.api.vestauth.com'), true)
})

t.test('#verifyAgentFqdn - scheme not allowed', async t => {
  t.throws(
    () => verifyAgentFqdn('http://agent-123.api.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})

t.test('#verifyAgentFqdn - path not allowed', async t => {
  t.throws(
    () => verifyAgentFqdn('agent-123.api.vestauth.com/.well-known'),
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
  const originalTool = process.env.TOOL_FQDN_REGEX
  const originalProvider = process.env.PROVIDER_FQDN_REGEX
  process.env.TOOL_FQDN_REGEX = '^custom-[A-Za-z0-9-]+\\.api\\.vestauth\\.com$'

  t.equal(verifyAgentFqdn('custom-abc.api.vestauth.com'), true)
  t.throws(
    () => verifyAgentFqdn('agent-123.api.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )

  if (originalTool === undefined) {
    delete process.env.TOOL_FQDN_REGEX
  } else {
    process.env.TOOL_FQDN_REGEX = originalTool
  }

  if (originalProvider === undefined) {
    delete process.env.PROVIDER_FQDN_REGEX
  } else {
    process.env.PROVIDER_FQDN_REGEX = originalProvider
  }
})

t.test('#verifyAgentFqdn - legacy env override still works', async t => {
  const originalTool = process.env.TOOL_FQDN_REGEX
  const originalProvider = process.env.PROVIDER_FQDN_REGEX
  delete process.env.TOOL_FQDN_REGEX
  process.env.PROVIDER_FQDN_REGEX = '^legacy-[A-Za-z0-9-]+\\.api\\.vestauth\\.com$'

  t.equal(verifyAgentFqdn('legacy-abc.api.vestauth.com'), true)
  t.throws(
    () => verifyAgentFqdn('agent-123.api.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )

  if (originalTool === undefined) {
    delete process.env.TOOL_FQDN_REGEX
  } else {
    process.env.TOOL_FQDN_REGEX = originalTool
  }

  if (originalProvider === undefined) {
    delete process.env.PROVIDER_FQDN_REGEX
  } else {
    process.env.PROVIDER_FQDN_REGEX = originalProvider
  }
})

t.test('#verifyAgentFqdn - TOOL_FQDN_REGEX takes precedence over PROVIDER_FQDN_REGEX', async t => {
  const originalTool = process.env.TOOL_FQDN_REGEX
  const originalProvider = process.env.PROVIDER_FQDN_REGEX
  process.env.TOOL_FQDN_REGEX = '^tool-[A-Za-z0-9-]+\\.api\\.vestauth\\.com$'
  process.env.PROVIDER_FQDN_REGEX = '^provider-[A-Za-z0-9-]+\\.api\\.vestauth\\.com$'

  t.equal(verifyAgentFqdn('tool-abc.api.vestauth.com'), true)
  t.throws(
    () => verifyAgentFqdn('provider-abc.api.vestauth.com'),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )

  if (originalTool === undefined) {
    delete process.env.TOOL_FQDN_REGEX
  } else {
    process.env.TOOL_FQDN_REGEX = originalTool
  }

  if (originalProvider === undefined) {
    delete process.env.PROVIDER_FQDN_REGEX
  } else {
    process.env.PROVIDER_FQDN_REGEX = originalProvider
  }
})
