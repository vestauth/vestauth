const { logger } = require('./../../../shared/logger')

const agent = require('./../../../lib/agent')

async function init () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await agent.init()

  if (output.isNew) {
    logger.success(`✔ agent created (${output.path}/AGENT_ID=${output.AGENT_ID})`)
  } else {
    logger.info(`• agent exists (${output.path}/AGENT_ID=${output.AGENT_ID})`)
  }

  logger.help('⮕ next run: [vestauth agent curl https://api.vestauth.com/whoami]')
}

module.exports = init
