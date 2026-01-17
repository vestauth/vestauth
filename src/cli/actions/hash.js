const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

function hash (message) {
  logger.debug(`message: ${message}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const hashMessage = main.hash(message)
  const hashBase64Url = Buffer.from(hashMessage).toString('base64url')

  const output = {
    hash: hashBase64Url
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = hash
