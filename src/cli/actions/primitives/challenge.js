const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

function challenge () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const chal = primitives.challenge()

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
