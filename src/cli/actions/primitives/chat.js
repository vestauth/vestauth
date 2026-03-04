const { logger } = require('./../../../shared/logger')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')
const Errors = require('./../../../lib/helpers/errors')

const primitives = require('./../../../lib/primitives')

async function chat (message) {
  try {
    logger.debug(`message: ${message}`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const output = await primitives.chat(message)

    let space = 0
    if (options.prettyPrint) {
      space = 2
    }

    console.log(JSON.stringify(output, null, space))
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = chat
