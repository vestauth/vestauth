function resolvePortAndHostname ({ port, hostname } = {}) {
  const hasPort = port !== undefined && port !== null && String(port).trim() !== ''
  const inputPort = hasPort ? String(port).trim() : null
  const inputHostname = typeof hostname === 'string' ? hostname.trim() : ''

  if (!inputHostname) {
    const PORT = inputPort || '3000'
    return {
      PORT,
      HOSTNAME: `http://localhost:${PORT}`
    }
  }

  const hasScheme = /^https?:\/\//i.test(inputHostname)
  const bareHostname = hasScheme ? new URL(inputHostname).host : inputHostname
  const bareHostNoPort = bareHostname.split(':')[0].toLowerCase()
  const localHostnames = new Set(['localhost', '127.0.0.1'])
  const defaultScheme = localHostnames.has(bareHostNoPort) ? 'http' : 'https'

  const url = new URL(hasScheme ? inputHostname : `${defaultScheme}://${inputHostname}`)

  const PORT = inputPort || url.port || '3000'

  if (!url.port && localHostnames.has(url.hostname.toLowerCase())) {
    url.port = PORT
  }

  return {
    PORT,
    HOSTNAME: url.toString().replace(/\/$/, '')
  }
}

module.exports = resolvePortAndHostname
