const { logger } = require('./../../../shared/logger')
const agent = require('./../../../lib/agent')
const execute = require('./../../../lib/helpers/execute')
const findUrl = require('./../../../lib/helpers/findUrl')

async function curl () {
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
    ...commandArgs
  ]

  const child = execute.execa(injected[0], injected.slice(1), { stdio: 'inherit' })

  // Wait for the command process to finish
  const { exitCode } = await child

  if (exitCode !== 0) {
    logger.debug(`received exitCode ${exitCode}`)
    throw new Error(`Command exited with exit code ${exitCode}`)
  }
}

module.exports = curl
