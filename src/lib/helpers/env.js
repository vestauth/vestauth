const dotenvx = require('@dotenvx/dotenvx')

function env (key) {
  try {
    return process.env[key] || dotenvx.get(key, { strict: true })
  } catch {
    return null
  }
}

module.exports = env
