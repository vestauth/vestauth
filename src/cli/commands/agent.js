const { Command } = require('commander')

const agent = new Command('agent')

agent
  .description('🪪 agent')
  .allowUnknownOption()

// vestauth agent auth
const authAction = require('./../actions/agent/auth')
agent.command('auth')
  .description('auth agent')
  .argument('<website>', 'root url of website')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(authAction)

// vestauth agent init
const initAction = require('./../actions/agent/init')
agent.command('init')
  .description('create agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(initAction)

// vestauth agent hello
const helloAction = require('./../actions/agent/hello')
agent.command('hello')
  .description('say hello')
  .action(helloAction)

module.exports = agent
