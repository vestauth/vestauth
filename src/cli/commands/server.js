const { Command } = require('commander')
const env = require('./../../lib/helpers/env')

const DEFAULT_DATABASE_URL = 'postgres://localhost/vestauth_production'
const DEFAULT_PORT = '3000'
const DEFAULT_HOSTNAME = 'http://localhost:3000'

const server = new Command('server')

server
  .description('🖥️  server')
  .allowUnknownOption()

// vestauth server init
const initAction = require('./../actions/server/init')
server.command('init')
  .description('create/update vestauth server .env')
  .option('--port <port>', 'port', env('PORT') || DEFAULT_PORT)
  .option('--hostname <hostname>', 'HOSTNAME', env('HOSTNAME') || DEFAULT_HOSTNAME)
  .option('--database-url <databaseUrl>', 'DATABASE_URL', env('DATABASE_URL') || DEFAULT_DATABASE_URL)
  .action(initAction)

// vestauth server start
const startAction = require('./../actions/server/start')
server.command('start')
  .description('start vestauth server')
  .option('--port <port>', 'port', env('PORT'))
  .option('--hostname <hostname>', 'HOSTNAME', env('HOSTNAME'))
  .option('--database-url <databaseUrl>', 'DATABASE_URL', env('DATABASE_URL') || DEFAULT_DATABASE_URL)
  .action(startAction)

// vestauth server db:create
const dbCreateAction = require('./../actions/server/dbCreate')
server.command('db:create')
  .description('create vestauth database')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', env('DATABASE_URL') || DEFAULT_DATABASE_URL)
  .action(dbCreateAction)

// vestauth server db:migrate
const dbMigrateAction = require('./../actions/server/dbMigrate')
server.command('db:migrate')
  .description('run database migrations')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', env('DATABASE_URL') || DEFAULT_DATABASE_URL)
  .action(dbMigrateAction)

// vestauth server db:drop
const dbDropAction = require('./../actions/server/dbDrop')
server.command('db:drop')
  .description('delete vestauth database')
  .option('--database-url <databaseUrl>', 'DATABASE_URL', env('DATABASE_URL') || DEFAULT_DATABASE_URL)
  .action(dbDropAction)

module.exports = server
