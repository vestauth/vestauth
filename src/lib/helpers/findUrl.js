function findUrl (args) {
  for (const arg of args) {
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      return arg
    }
  }
  return null
}

module.exports = findUrl
