#!/usr/bin/env node

/* c8 ignore start */
const { Command } = require('commander')
const program = new Command()

const { setLogLevel, logger } = require('../shared/logger')
const packageJson = require('./../lib/helpers/packageJson')
const Errors = require('./../lib/helpers/errors')
const getCommanderVersion = require('./../lib/helpers/getCommanderVersion')

// surface hoisting problems
const commanderVersion = getCommanderVersion()
if (commanderVersion && parseInt(commanderVersion.split('.')[0], 10) >= 12) {
  const message = `vestauth depends on commander@11.x.x but you are attempting to hoist commander@${commanderVersion}`
  const error = new Errors({ message }).dangerousDependencyHoist()
  logger.error(error.message)
  if (error.help) logger.error(error.help)
}

// global log levels
program
  .usage('vestauth')
  .option('-l, --log-level <level>', 'set log level', 'info')
  .option('-q, --quiet', 'sets log level to error')
  .option('-v, --verbose', 'sets log level to verbose')
  .option('-d, --debug', 'sets log level to debug')
  .hook('preAction', (thisCommand, actionCommand) => {
    const options = thisCommand.opts()

    setLogLevel(options)
  })

// cli
program
  .name('vestauth')
  .description(packageJson.description)
  .version(packageJson.version)
  .allowUnknownOption()

// vestauth challenge
const challengeAction = require('./actions/challenge')
program.command('challenge')
  .description('generate challenge')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(challengeAction)

// vestauth hash [message]
const hashAction = require('./actions/hash')
program.command('hash')
  .description('hash message')
  .argument('<message>', 'message string')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(hashAction)

// vestauth keypair
const keypairAction = require('./actions/keypair')
program.command('keypair')
  .description('generate public/private keypair')
  .argument('[private_key]', 'pre-existing private key')
  .option('--prefix <type>', 'agent (default) | provider | none', 'agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(keypairAction)

// vestauth sign
const signAction = require('./actions/sign')
program.command('sign')
  .description('sign challenge')
  .argument('<challenge>', 'challenge (base64url)')
  .argument('<privateKey>', 'private key (hex)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(signAction)

// vestauth verify
const verifyAction = require('./actions/verify')
program.command('verify')
  .description('verify signature')
  .argument('<challenge>', 'challenge (base64url)')
  .argument('<signature>', 'signature (base64url)')
  .argument('<publicKey>', 'public key (hex)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

// vestauth verifyAgent
const verifyAgentAction = require('./actions/verifyAgent')
program.command('verifyagent')
  .description('verify agent')
  .argument('<providerPrivateKey>', '')
  .argument('<providerChallenge>', '')
  .argument('<authorizationHeader>', '')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(verifyAgentAction)

// vestauth help
program.command('help [command]')
  .description('display help for command')
  .action((command) => {
    if (command) {
      const subCommand = program.commands.find(c => c.name() === command)
      if (subCommand) {
        subCommand.outputHelp()
      } else {
        program.outputHelp()
      }
    } else {
      program.outputHelp()
    }
  })

/* c8 ignore stop */

program.parse(process.argv)
