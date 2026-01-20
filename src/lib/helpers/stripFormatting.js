function stripFormatting (key) {
  return String(key).split('_').at(-1)
}

module.exports = stripFormatting
