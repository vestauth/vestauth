const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function verifyAgent (providerPrivateKey, providerChallenge, agentPublicKey, agentSignature) {
  logger.debug(`providerPrivateKey: ${providerPrivateKey}`)
  logger.debug(`providerChallenge: ${providerChallenge}`)
  logger.debug(`agentPublicKey: ${agentPublicKey}`)
  logger.debug(`agentSignature: ${agentSignature}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const json = await main.verifyAgent(providerPrivateKey, providerChallenge, agentPublicKey, agentSignature)

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(json, null, space))
}

module.exports = verifyAgent
