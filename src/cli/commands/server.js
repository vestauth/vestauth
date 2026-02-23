const { Command } = require('commander')
const env = require('./../../lib/helpers/env')
const databaseUrl = require('./../../lib/helpers/databaseUrl')

const server = new Command('server')

server
  .description('🖥️  server')
  .allowUnknownOption()

// vestauth server start
const startAction = require('./../actions/server/start')
server.command('start')
  .description('start vestauth server')
  .option('--port <port>', 'port', env('PORT'))
  .option('--database-url <databaseUrl>', 'DATABASE_URL', databaseUrl())
  .action(startAction)

// vestauth server db:create
const dbCreateAction = require('./../actions/server/dbCreate')
server.command('db:create')
  .description('create vestauth database')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', databaseUrl())
  .action(dbCreateAction)

// vestauth server db:migrate
const dbMigrateAction = require('./../actions/server/dbMigrate')
server.command('db:migrate')
  .description('run db migrations')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', databaseUrl())
  .action(dbMigrateAction)

// vestauth server db:drop
const dbDropAction = require('./../actions/server/dbDrop')
server.command('db:drop')
  .description('delete vestauth database')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', databaseUrl())
  .action(dbDropAction)

module.exports = server
