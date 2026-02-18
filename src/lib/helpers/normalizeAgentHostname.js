const env = require('./env')

function normalizeAgentHostname (hostname = null) {
  const envHostname = env('AGENT_HOSTNAME')
  const value = (hostname || envHostname || 'api.vestauth.com').trim()
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const url = new URL(candidate)

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('invalid --hostname. path/query/hash are not allowed')
  }

  return url.origin
}

module.exports = normalizeAgentHostname
