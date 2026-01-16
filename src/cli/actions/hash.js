const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

function hash (message) {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const hashMessage = main.hash(message)
  const hashBase64Url = Buffer.from(hashMessage).toString('base64url')

  console.log(hashBase64Url)
}

module.exports = hash
