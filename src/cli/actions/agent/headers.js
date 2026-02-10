const { logger } = require('./../../../shared/logger')

const agent = require('./../../../lib/agent')

async function headers (httpMethod, uri) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const uid = options.uid || options.id
  const output = await agent.headers(httpMethod, uri, uid, options.privateJwk, options.tag, options.nonce)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = headers
