function isLocalhost (wellKnownUrl) {
  const url = new URL(wellKnownUrl)
  return url.hostname === 'localhost' || url.hostname.endsWith('.localhost')
}

module.exports = isLocalhost
