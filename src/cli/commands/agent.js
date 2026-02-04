const { Command } = require('commander')
const env = require('./../../lib/helpers/env')

const agent = new Command('agent')

agent
  .usage('run -- yourcommand')
  .description('▶️  agent')
  .allowUnknownOption()

// vestauth agent init
const initAction = require('./../actions/agent/init')
agent.command('init')
  .description('create agent')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(initAction)

// vestauth agent curl
const curlAction = require('./../actions/agent/curl')
agent.command('curl')
  .description('run curl as agent')
  .allowUnknownOption()
  .option('--tag <tag>', 'web-bot-auth (default) | web-bot-auth', 'web-bot-auth')
  .option('--nonce <nonce>', 'null (default)')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(curlAction)

// vestauth agent headers
const headersAction = require('./../actions/agent/headers')
agent.command('headers')
  .description('generate headers as agent')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .option('--id <id>', 'id (string)', env('AGENT_ID'))
  .option('--privateJwk <privateJwk>', 'AGENT_PRIVATE_JWK (default)', env('AGENT_PRIVATE_JWK'))
  .option('--tag <tag>', 'web-bot-auth (default) | web-bot-auth', 'web-bot-auth')
  .option('--nonce <nonce>', 'null (default)')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(headersAction)

module.exports = agent
