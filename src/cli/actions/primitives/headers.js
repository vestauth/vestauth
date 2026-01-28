const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

async function headers (httpMethod, uri, privateKey) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)
  logger.debug(`privateKey: ${privateKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await primitives.headers(httpMethod, uri, privateKey, options.tag, options.nonce)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = headers
