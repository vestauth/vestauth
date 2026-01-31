const { logger } = require('./../../../shared/logger')

const provider = require('./../../../lib/provider')

async function verify (httpMethod, uri, signatureHeader, signatureInputHeader) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)
  logger.debug(`signatureHeader: ${signatureHeader}`)
  logger.debug(`signatureInputHeader: ${signatureInputHeader}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await provider.verify(httpMethod, uri, signatureHeader, signatureInputHeader)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = verify
