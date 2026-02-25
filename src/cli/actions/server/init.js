const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const server = require('./../../../lib/server')

async function init () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    console.log('IMPLEMENT')

    // await server.init({
    //   port: options.port,
    //   hostname: options.hostname,
    //   databaseUrl: options.databaseUrl
    // })
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = init
