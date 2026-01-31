const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

async function verify (httpMethod, uri, signature, signatureInput, publicKey) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)
  logger.debug(`signature: ${signature}`)
  logger.debug(`signatureInput: ${signatureInput}`)
  logger.debug(`publicKey: ${publicKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const output = await primitives.verify(httpMethod, uri, signature, signatureInput, JSON.parse(publicKey))
  // const output = await primitive.verifyWebBotAuth(httpMethod, uri, signature, signatureInput, JSON.parse(publicKey))

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = verify
