const escapeRegex = require('./escapeRegex')
const extractHostAndHostname = require('./extractHostAndHostname')

const TRUSTED_FQDN_REGEX = /^[A-Za-z0-9-]+\.(?:agents|api)\.vestauth\.com$/

function trustedFqdn (fqdn, hostname = null) {
  fqdn = fqdn.toLowerCase()

  // .api.vestauth.com trusted
  if (TRUSTED_FQDN_REGEX.test(fqdn)) return true

  // self .HOSTNAME trusted
  if (hostname) {
    const { host } = extractHostAndHostname(hostname)
    const HOSTNAME_REGEX = new RegExp(`^[A-Za-z0-9-]+.${escapeRegex(host)}$`)
    if (HOSTNAME_REGEX.test(fqdn)) return true
  }

  // user sets TOOL_FQDN_REGEX in environment (.env)
  const override = process.env.TOOL_FQDN_REGEX || process.env.PROVIDER_FQDN_REGEX
  if (override) {
    const OVERRIDE_REGEX = new RegExp(`${escapeRegex(override)}`)
    if (OVERRIDE_REGEX.test(fqdn)) return true
  }

  return false
}

module.exports = trustedFqdn
