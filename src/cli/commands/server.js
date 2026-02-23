const { Command } = require('commander')
const env = require('./../../lib/helpers/env')

const server = new Command('server')

server
  .description('🖥️  server')
  .allowUnknownOption()

// vestauth server start
const startAction = require('./../actions/server/start')
server.command('start')
  .description('start vestauth server')
  .option('--port <port>', 'port', env('PORT'))
  .action(startAction)

module.exports = server
