const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function verify (challenge, signatureBase64, publicKeyHex) {
  logger.debug(`challenge: ${challenge}`)
  logger.debug(`signature: ${signatureBase64}`)
  logger.debug(`publicKey: ${publicKeyHex}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const success = main.verify(challenge, signatureBase64, publicKeyHex)

  const output = {
    success,
    public_key: publicKeyHex
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = verify
