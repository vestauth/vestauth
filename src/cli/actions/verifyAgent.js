const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function verifyAgent (providerPrivateKey, providerChallenge, authorizationHeader) {
  logger.debug(`providerPrivateKey: ${providerPrivateKey}`)
  logger.debug(`providerChallenge: ${providerChallenge}`)
  logger.debug(`authorizationHeader: ${authorizationHeader}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const json = await main.verifyAgent(providerPrivateKey, providerChallenge, authorizationHeader)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(json, null, space))
}

module.exports = verifyAgent
