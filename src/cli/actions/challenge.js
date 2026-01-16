const { logger } = require('./../../shared/logger')

const main = require('./../../lib/main')

function challenge () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const chal = main.challenge()

  console.log(chal)
}

module.exports = challenge
