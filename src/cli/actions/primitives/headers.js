const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')
const env = require('./../../../lib/helpers/env')

const primitives = require('./../../../lib/primitives')

async function headers (httpMethod, uri) {
  try {
    logger.debug(`httpMethod: ${httpMethod}`)
    logger.debug(`uri: ${uri}`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const uid = options.uid || options.id || env('AGENT_UID') || env('AGENT_ID')
    const output = await primitives.headers(httpMethod, uri, uid, options.privateJwk, options.tag, options.nonce)

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
