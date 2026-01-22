const { logger } = require('./../../../shared/logger')

const main = require('./../../../lib/main')

function challenge () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const chal = main.challenge()

  const output = {
    challenge: chal
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = challenge
