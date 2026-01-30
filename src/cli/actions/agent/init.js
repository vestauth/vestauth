const { logger } = require('./../../../shared/logger')

const agent = require('./../../../lib/agent')

async function init () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await agent.init()

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = init
