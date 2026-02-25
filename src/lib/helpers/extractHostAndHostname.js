function extractHostAndHostname (uri) {
  const isUri = /^https?:\/\//i.test(uri)

  // add protocol if missing
  const origin = isUri ? new URL(uri).origin : `https://${uri}`

  const url = new URL(origin)
  const host = url.host // hostname + port
  const hostname = url.hostname

  return {
    host,
    hostname,
    origin
  }
}

module.exports = extractHostAndHostname
