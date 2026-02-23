function isEmptyObject (value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.keys(value).length === 0
}

module.exports = isEmptyObject
