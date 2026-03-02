const { logger } = require('./../../../shared/logger')
const agent = require('./../../../lib/agent')
const execute = require('./../../../lib/helpers/execute')
const Errors = require('./../../../lib/helpers/errors')
const findUrl = require('./../../../lib/helpers/findUrl')
const catchAndLog = require('./../../../lib/helpers/catchAndLog')

function requestMethodFromArgs (args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-X' || arg === '--request') {
      const method = args[i + 1]
      if (method) return method.toUpperCase()
      continue
    }

    if (arg.startsWith('--request=')) {
      return arg.slice('--request='.length).toUpperCase()
    }

    if (arg.startsWith('-X') && arg.length > 2) {
      return arg.slice(2).toUpperCase()
    }
  }

  return null
}

function hasContentTypeHeader (args) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '-H' || arg === '--header') {
      const header = args[i + 1] || ''
      if (header.toLowerCase().startsWith('content-type:')) return true
      continue
    }

    if (arg.startsWith('--header=')) {
      const header = arg.slice('--header='.length)
      if (header.toLowerCase().startsWith('content-type:')) return true
      continue
    }

    if (arg.startsWith('-H') && arg.length > 2) {
      const header = arg.slice(2)
      if (header.toLowerCase().startsWith('content-type:')) return true
    }
  }

  return false
}

async function curl () {
  try {
    const commandArgs = this.args
    logger.debug(`process command [${commandArgs.join(' ')}]`)

    const options = this.opts()
    logger.debug(`options: ${JSON.stringify(options)}`)

    const httpMethod = requestMethodFromArgs(commandArgs) || 'POST'
    const url = findUrl(commandArgs)
    const headers = await agent.headers(httpMethod, url)
    const includeRequestMethod = requestMethodFromArgs(commandArgs) === null
    const includeContentType = !hasContentTypeHeader(commandArgs)
    const injected = [
      'curl',
      '-H', `Signature: ${headers.Signature}`,
      '-H', `Signature-Input: ${headers['Signature-Input']}`,
      '-H', `Signature-Agent: ${headers['Signature-Agent']}`,
      ...(includeRequestMethod ? ['-X', 'POST'] : []),
      ...(includeContentType ? ['-H', 'Content-Type: application/json'] : []),
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
