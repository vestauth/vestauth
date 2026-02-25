const { logger } = require('../../shared/logger')
const dotenvx = require('@dotenvx/dotenvx')

function env (key) {
  try {
    return process.env[key] || dotenvx.get(key, { strict: false, ignore: ['MISSING_ENV_FILE', 'MISSING_KEY'] })
  } catch (error) {
    logger.error(error.message)
    if (error.help) logger.help(error.help)
    return null
  }
}

module.exports = env
