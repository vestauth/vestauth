const { logger } = require('./../../../shared/logger')

const agent = require('./../../../lib/agent')

async function auth (website) {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await agent.auth(website)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = auth
