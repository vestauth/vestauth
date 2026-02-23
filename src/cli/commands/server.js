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

// vestauth server db:create
const dbCreateAction = require('./../actions/server/dbCreate')
server.command('db:create')
  .description('create vestauth database')
  .action(dbCreateAction)

// vestauth server db:drop
const dbDropAction = require('./../actions/server/dbDrop')
server.command('db:drop')
  .description('delete vestauth database')
  .action(dbDropAction)

module.exports = server
