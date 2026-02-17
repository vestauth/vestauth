function normalizeAgentApiOrigin (hostname = null) {
  const value = (hostname || process.env.AGENT_HOSTNAME || 'api.vestauth.com').trim()
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const url = new URL(candidate)

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('invalid --hostname. path/query/hash are not allowed')
  }

  return url.origin
}

module.exports = normalizeAgentApiOrigin
