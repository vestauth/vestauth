const t = require('tap')
t.jobs = 1

const helperPath = require.resolve('../../../src/lib/helpers/dbMigrate')
const knexPath = require.resolve('knex')

let originalKnexModule
let knexConfig
let destroyCalls
let latestCalls

function mockKnex (latestResult = [1, ['a.js']]) {
  knexConfig = null
  destroyCalls = 0
  latestCalls = 0

  require.cache[knexPath] = {
    exports: (config) => {
      knexConfig = config
      return {
        migrate: {
          latest: async () => {
            latestCalls += 1
            return latestResult
          }
        },
        destroy: async () => {
          destroyCalls += 1
        }
      }
    }
  }

  delete require.cache[helperPath]
}

t.beforeEach(() => {
  originalKnexModule = require.cache[knexPath]
  delete require.cache[helperPath]
})

t.afterEach(() => {
  if (originalKnexModule) require.cache[knexPath] = originalKnexModule
  else delete require.cache[knexPath]

  delete require.cache[helperPath]
})

t.test('runs pending migrations and returns batch/log', async t => {
  mockKnex([3, ['001_init.js', '002_public_jwks.js']])

  const dbMigrate = require('../../../src/lib/helpers/dbMigrate')
  const result = await dbMigrate({ databaseUrl: 'postgres://localhost/vestauth_production' })

  t.same(result, { batchNo: 3, migrations: ['001_init.js', '002_public_jwks.js'] })
  t.equal(knexConfig.client, 'pg')
  t.equal(knexConfig.connection, 'postgres://localhost/vestauth_production')
  t.match(knexConfig.migrations.directory, /src[/\\]server[/\\]db[/\\]migration$/)
  t.equal(latestCalls, 1)
  t.equal(destroyCalls, 1)
})

t.test('throws when databaseUrl is not provided', async t => {
  mockKnex()
  const dbMigrate = require('../../../src/lib/helpers/dbMigrate')

  await t.rejects(() => dbMigrate(), /missing DATABASE_URL/)
})
