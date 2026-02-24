const DEFAULT_TOOL_FQDN_REGEX = /^[A-Za-z0-9-]+\.(?:agents|api)\.vestauth\.com$/
const Errors = require('./errors')

function getToolFqdnRegex () {
  const override = process.env.TOOL_FQDN_REGEX || process.env.PROVIDER_FQDN_REGEX
  if (!override) return DEFAULT_TOOL_FQDN_REGEX

  try {
    return new RegExp(override)
  } catch {
    return DEFAULT_TOOL_FQDN_REGEX
  }
}

function verifyAgentFqdn (fqdn) {
  if (!fqdn || typeof fqdn !== 'string') {
    throw new Errors().invalidSignatureAgent()
  }
  const pattern = getToolFqdnRegex()
  if (!pattern.test(fqdn)) {
    throw new Errors().invalidSignatureAgent()
  }

  return true
}

module.exports = verifyAgentFqdn
