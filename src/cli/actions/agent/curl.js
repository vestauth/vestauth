const { logger } = require('./../../../shared/logger')
const agent = require('./../../../lib/agent')
const execute = require('./../../../lib/helpers/execute')
const Errors = require('./../../../lib/helpers/errors')
const findUrl = require('./../../../lib/helpers/findUrl')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

async function curl () {
  try {
    const commandArgs = this.args
    logger.debug(`process command [${commandArgs.join(' ')}]`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const httpMethod = 'GET'
    const url = findUrl(commandArgs)
    const headers = await agent.headers(httpMethod, url)
    const injected = [
      'curl',
      '-H', `Signature: ${headers.Signature}`,
      '-H', `Signature-Input: ${headers['Signature-Input']}`,
      '-H', `Signature-Agent: ${headers['Signature-Agent']}`,
      ...commandArgs
    ]

    const { stdout, exitCode } = await execute.execa(injected[0], injected.slice(1), {})

    logger.debug(`exitCode: ${exitCode}`)
    logger.debug(`stdout: ${stdout}`)

    if (exitCode !== 0) {
      logger.debug(`received exitCode ${exitCode}`)
      throw new Errors({ exitCode }).commandFailed()
    }

    let space = 0
    if (options.prettyPrint) {
      space = 2
    }

    console.log(JSON.stringify(JSON.parse(stdout), null, space))
  } catch (error) {
    catchAndLog(error)
    process.exit(1)
  }
}

module.exports = curl
