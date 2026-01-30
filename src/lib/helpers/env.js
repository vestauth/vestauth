const dotenvx = require('@dotenvx/dotenvx')

function env(key) {
  try {
    return dotenvx.get(key, { strict: true })
  } catch {
    return null
  }
}

module.exports = env
