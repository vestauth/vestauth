const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const server = require('./../../../lib/server')

async function dbMigrate () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    await server.db.migrate({ databaseUrl: options.databaseUrl })
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = dbMigrate
