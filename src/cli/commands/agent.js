const { Command } = require('commander')

const agent = new Command('agent')

agent
  .usage('run -- yourcommand')
  .description('🤖 agent')
  .allowUnknownOption()

// vestauth agent init
const initAction = require('./../actions/agent/init')
agent.command('init')
  .description('create agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(initAction)

// vestauth agent curl
const curlAction = require('./../actions/agent/curl')
agent.command('curl')
  .description('run curl as agent')
  .allowUnknownOption()
  .option('--tag <tag>', 'vestauth (default) | web-bot-auth', 'vestauth')
  .option('--nonce <nonce>', 'null (default)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(curlAction)

// vestauth agent headers
const headersAction = require('./../actions/agent/headers')
agent.command('headers')
  .description('generate headers as agent')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .option('--tag <tag>', 'vestauth (default) | web-bot-auth', 'vestauth')
  .option('--nonce <nonce>', 'null (default)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(headersAction)

module.exports = agent
