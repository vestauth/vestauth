const dotenvx = require('@dotenvx/dotenvx')

function env (key) {
  if (Object.prototype.hasOwnProperty.call(process.env, key)) {
    return process.env[key]
  }

  try {
    return dotenvx.get(key, { strict: true })
  } catch {
    return null
  }
}

module.exports = env
