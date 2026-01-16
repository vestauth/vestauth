const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function sign (challenge, privateKeyHex) {
  logger.debug(`challenge: ${challenge}`)
  logger.debug(`privateKey: ${privateKeyHex}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const signature = await main.sign(challenge, privateKeyHex)

  console.log(signature)
}

module.exports = sign
