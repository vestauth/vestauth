const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const agent = require('./../../../lib/agent')

async function rotate () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const output = await agent.rotate(options.id, options.privateJwk, options.tag, options.nonce)

    logger.success(`✔ agent keys rotated (${output.path}/AGENT_ID=${output.AGENT_ID})`)
    logger.help('⮕ next run: [vestauth agent curl https://api.vestauth.com/whoami]')
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = rotate
