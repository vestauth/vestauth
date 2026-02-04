const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

const primitives = require('./../../../lib/primitives')

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

    const publicJwk = JSON.parse(options.publicJwk || {})

    const output = await primitives.verify(httpMethod, uri, headers, publicJwk)
    // const output = await primitive.verifyWebBotAuth(httpMethod, uri, signature, signatureInput, JSON.parse(publicJwk))

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
