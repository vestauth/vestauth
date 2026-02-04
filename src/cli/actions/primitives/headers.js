const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const primitives = require('./../../../lib/primitives')

async function headers (httpMethod, uri) {
  try {
    logger.debug(`httpMethod: ${httpMethod}`)
    logger.debug(`uri: ${uri}`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const output = await primitives.headers(httpMethod, uri, options.id, options.privateKey, options.tag, options.nonce)

    let space = 0
    if (options.prettyPrint) {
      space = 2
    }

    console.log(JSON.stringify(output, null, space))
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = headers
