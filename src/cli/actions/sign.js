const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

async function sign (challenge, privateKeyHex) {
  logger.debug(`challenge: ${challenge}`)
  logger.debug(`privateKey: ${privateKeyHex}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const signature = await main.sign(challenge, privateKeyHex)

  const output = {
    signature
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = sign
