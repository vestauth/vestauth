const { Command } = require('commander')

const server = new Command('server')

server
  .description('🖥️  server')
  .allowUnknownOption()

// vestauth server start
const startAction = require('./../actions/server/start')
server.command('start')
  .description('start vestauth server')
  .action(startAction)

module.exports = server
