const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')
const env = require('./../../../lib/helpers/env')

const agent = require('./../../../lib/agent')

async function rotate () {
  try {
    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const uid = options.uid || options.id || env('AGENT_UID') || env('AGENT_ID')
    const output = await agent.rotate(uid, options.privateJwk, options.tag, options.nonce, options.hostname)

    logger.success(`✔ agent keys rotated (${output.path}/AGENT_UID=${output.AGENT_UID})`)
    logger.help('⮕ next run: [vestauth agent curl https://api.vestauth.com/whoami]')
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = rotate
