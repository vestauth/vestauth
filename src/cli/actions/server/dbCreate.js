const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')
const databaseUrl = require('./../../../lib/helpers/databaseUrl')

const server = require('./../../../lib/server')

async function dbCreate () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    await server.db.create({ databaseUrl: databaseUrl(options.databaseUrl) })
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = dbCreate
