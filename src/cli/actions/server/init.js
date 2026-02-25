const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const server = require('./../../../lib/server')

async function init () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    attrs = {
      port: options.port,
      hostname: options.hostname,
      databaseUrl: options.databaseUrl
    }
    const output = await server.init(attrs)

    logger.success(`✔ ready (${output.path}/HOSTNAME=${output.HOSTNAME})`)
    logger.help(`⮕ next run: [vestauth server start]`)
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = init
