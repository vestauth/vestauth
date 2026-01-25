const { logger } = require('./../../../shared/logger')

const prov = require('./../../../lib/provider')

async function provider (website) {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await prov.challenge()

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = provider
