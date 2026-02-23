const t = require('tap')
t.jobs = 1

const dbCreateActionPath = require.resolve('../../../../src/cli/actions/server/dbCreate')
const dbMigrateActionPath = require.resolve('../../../../src/cli/actions/server/dbMigrate')
const dbDropActionPath = require.resolve('../../../../src/cli/actions/server/dbDrop')
const startActionPath = require.resolve('../../../../src/cli/actions/server/start')

const loggerPath = require.resolve('../../../../src/shared/logger')
const catchAndLogPath = require.resolve('../../../../src/lib/helpers/catchAndLog')
const serverPath = require.resolve('../../../../src/lib/server')

let originalLoggerModule
let originalCatchAndLogModule
let originalServerModule
let calls

function mockCommonDeps () {
  calls = []

  require.cache[loggerPath] = {
    exports: {
      logger: {
        debug: () => {}
      }
    }
  }

  require.cache[catchAndLogPath] = {
    exports: () => {}
  }

  require.cache[serverPath] = {
    exports: {
      start: async (options) => {
        calls.push({ method: 'start', options })
      },
      db: {
        create: async (options) => {
          calls.push({ method: 'db:create', options })
        },
        migrate: async (options) => {
          calls.push({ method: 'db:migrate', options })
        },
        drop: async (options) => {
          calls.push({ method: 'db:drop', options })
        }
      }
    }
  }

  delete require.cache[dbCreateActionPath]
  delete require.cache[dbMigrateActionPath]
  delete require.cache[dbDropActionPath]
  delete require.cache[startActionPath]
}

t.beforeEach(() => {
  originalLoggerModule = require.cache[loggerPath]
  originalCatchAndLogModule = require.cache[catchAndLogPath]
  originalServerModule = require.cache[serverPath]
  delete require.cache[dbCreateActionPath]
  delete require.cache[dbMigrateActionPath]
  delete require.cache[dbDropActionPath]
  delete require.cache[startActionPath]
})

t.afterEach(() => {
  if (originalLoggerModule) require.cache[loggerPath] = originalLoggerModule
  else delete require.cache[loggerPath]

  if (originalCatchAndLogModule) require.cache[catchAndLogPath] = originalCatchAndLogModule
  else delete require.cache[catchAndLogPath]

  if (originalServerModule) require.cache[serverPath] = originalServerModule
  else delete require.cache[serverPath]

  delete require.cache[dbCreateActionPath]
  delete require.cache[dbMigrateActionPath]
  delete require.cache[dbDropActionPath]
  delete require.cache[startActionPath]
})

t.test('server db:create action passes databaseUrl to server helper', async t => {
  mockCommonDeps()
  const action = require('../../../../src/cli/actions/server/dbCreate')

  await action.call({
    opts: () => ({ databaseUrl: 'postgres://localhost/vestauth_production' })
  })

  t.same(calls, [{
    method: 'db:create',
    options: { databaseUrl: 'postgres://localhost/vestauth_production' }
  }])
})

t.test('server db:migrate action passes databaseUrl to server helper', async t => {
  mockCommonDeps()
  const action = require('../../../../src/cli/actions/server/dbMigrate')

  await action.call({
    opts: () => ({ databaseUrl: 'postgres://localhost/vestauth_production' })
  })

  t.same(calls, [{
    method: 'db:migrate',
    options: { databaseUrl: 'postgres://localhost/vestauth_production' }
  }])
})

t.test('server db:drop action passes databaseUrl to server helper', async t => {
  mockCommonDeps()
  const action = require('../../../../src/cli/actions/server/dbDrop')

  await action.call({
    opts: () => ({ databaseUrl: 'postgres://localhost/vestauth_production' })
  })

  t.same(calls, [{
    method: 'db:drop',
    options: { databaseUrl: 'postgres://localhost/vestauth_production' }
  }])
})

t.test('server start action passes port and databaseUrl to server helper', async t => {
  mockCommonDeps()
  const action = require('../../../../src/cli/actions/server/start')

  await action.call({
    opts: () => ({
      port: '4000',
      databaseUrl: 'postgres://localhost/vestauth_production'
    })
  })

  t.same(calls, [{
    method: 'start',
    options: {
      port: '4000',
      databaseUrl: 'postgres://localhost/vestauth_production'
    }
  }])
})
