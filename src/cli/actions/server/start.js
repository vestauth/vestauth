const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

async function start () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    console.log('start the server here')
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = start
