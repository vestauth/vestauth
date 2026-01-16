const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function verify (challenge, signatureBase64, publicKeyHex) {
  logger.debug(`challenge: ${challenge}`)
  logger.debug(`signature: ${signatureBase64}`)
  logger.debug(`publicKey: ${publicKeyHex}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const isValid = main.verify(challenge, signatureBase64, publicKeyHex)

  console.log(isValid)
}

module.exports = verify
