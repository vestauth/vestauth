function epoch (ttlSeconds = 300) {
  const now = Date.now()
  const created = Math.floor(now / 1000)
  const expires = created + ttlSeconds // 300 -> 5 minutes

  return {
    created,
    expires
  }
}

module.exports = epoch
