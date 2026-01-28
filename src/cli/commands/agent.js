const { Command } = require('commander')

const agent = new Command('agent')

agent
  .description('🪪 agent')
  .allowUnknownOption()

// vestauth agent init
const initAction = require('./../actions/agent/init')
agent.command('init')
  .description('create agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(initAction)

// vestauth agent headers
const headersAction = require('./../actions/agent/headers')
agent.command('headers')
  .description('generate signed headers')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .option('--tag <tag>', 'vestauth (default) | web-bot-auth', 'vestauth')
  .option('--nonce <nonce>', 'null (default)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(headersAction)

// vestauth agent hello
const helloAction = require('./../actions/agent/hello')
agent.command('hello')
  .description('say hello')
  .action(helloAction)

module.exports = agent
