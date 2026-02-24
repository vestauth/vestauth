function subdomainBaseHost (hostname) {
  if (!hostname) return null

  const value = String(hostname).trim().toLowerCase()
  if (!value) return null

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      return new URL(value).hostname.toLowerCase()
    } catch {
      return null
    }
  }

  return value.split('/')[0].split(':')[0]
}

module.exports = subdomainBaseHost
