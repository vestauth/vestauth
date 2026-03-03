const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const tool = require('./../../../lib/tool')

async function init () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const output = await tool.init(options.hostname)

    if (output.isNew) {
      logger.success(`✔ tool created (${output.path}/TOOL_UID=${output.TOOL_UID})`)
    } else {
      logger.info(`• tool exists (${output.path}/TOOL_UID=${output.TOOL_UID})`)
    }

    logger.help(`⮕ next run: [vestauth agent curl ${output.TOOL_HOSTNAME}/whoami]`)
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = init
