const DEFAULT_PROVIDER_FQDN_REGEX = /^[A-Za-z0-9-]+\.agents\.vestauth\.com$/

function getProviderFqdnRegex () {
  const override = process.env.PROVIDER_FQDN_REGEX
  if (!override) return DEFAULT_PROVIDER_FQDN_REGEX

  try {
    return new RegExp(override)
  } catch {
    return DEFAULT_PROVIDER_FQDN_REGEX
  }
}

function verifyAgentFqdn (fqdn) {
  if (!fqdn || typeof fqdn !== 'string') {
    throw new Error('Invalid agent fqdn')
  }

  const pattern = getProviderFqdnRegex()
  if (!pattern.test(fqdn)) {
    throw new Error('Invalid agent fqdn')
  }

  return true
}

module.exports = verifyAgentFqdn
