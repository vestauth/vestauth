const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const agent = require('./../../../lib/agent')

async function init () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const output = await agent.init()

    if (output.isNew) {
      logger.success(`✔ agent created (${output.path}/AGENT_ID=${output.AGENT_ID})`)
    } else {
      logger.info(`• agent exists (${output.path}/AGENT_ID=${output.AGENT_ID})`)
    }

    logger.help('⮕ next run: [vestauth agent curl https://api.vestauth.com/whoami]')
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = init
