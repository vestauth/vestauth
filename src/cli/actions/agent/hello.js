const { logger } = require('./../../../shared/logger')

const agent = require('./../../../lib/agent')

function hello () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)


  const output = {
    hello: agent.hello()
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = hello
