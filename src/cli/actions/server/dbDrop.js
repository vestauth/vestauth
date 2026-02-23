const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const server = require('./../../../lib/server')

async function dbDrop () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    await server.db.drop()
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = dbDrop
