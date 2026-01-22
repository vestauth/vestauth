const { Command } = require('commander')

const agent = new Command('agent')

agent
  .description('🪪 agent')
  .allowUnknownOption()

// vestauth agent hello
const helloAction = require('./../actions/agent/hello')
agent.command('hello')
  .description('say hello')
  .action(helloAction)

module.exports = agent
