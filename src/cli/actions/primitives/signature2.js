const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

async function signature2 (privateKey) {
  logger.debug(`privateKey: ${privateKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await primitives.signature2(privateKey, options.tag)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = signature2
