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
  .usage('agent init')
  .option('--log-level <level>', 'set log level', 'info')
  .option('--quiet', 'sets log level to error')
  .option('--verbose', 'sets log level to verbose')
  .option('--debug', 'sets log level to debug')
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

program.addCommand(require('./commands/agent'))
program.addCommand(require('./commands/tool'))
program.addCommand(require('./commands/provider'), { hidden: true })
program.addCommand(require('./commands/primitives'))

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
