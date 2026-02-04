const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const provider = require('./../../../lib/provider')

async function verify (httpMethod, uri) {
  try {
    logger.debug(`httpMethod: ${httpMethod}`)
    logger.debug(`uri: ${uri}`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const headers = {
      Signature: options.signature,
      'Signature-Input': options.signatureInput,
      'Signature-Agent': options.signatureAgent
    }

    const output = await provider.verify(httpMethod, uri, headers)

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

module.exports = verify
