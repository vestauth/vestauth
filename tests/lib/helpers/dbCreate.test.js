const t = require('tap')
t.jobs = 1

const helperPath = require.resolve('../../../src/lib/helpers/dbCreate')
const knexPath = require.resolve('knex')

let originalKnexModule
let rawCalls
let destroyCalls
let knexConfigs
let rawResponses

function mockKnex () {
  rawCalls = []
  destroyCalls = 0
  knexConfigs = []
  rawResponses = []

  require.cache[knexPath] = {
    exports: (config) => {
      knexConfigs.push(config)
      return {
        raw: async (sql, params) => {
          rawCalls.push({ sql, params })
          return rawResponses.shift() || {}
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

t.test('creates database when missing', async t => {
  mockKnex()
  rawResponses.push({ rows: [] }, {})

  const dbCreate = require('../../../src/lib/helpers/dbCreate')
  const result = await dbCreate({ databaseUrl: 'postgres://localhost/vestauth_production' })

  t.same(result, { created: true, database: 'vestauth_production' })
  t.equal(knexConfigs[0].connection, 'postgres://localhost/postgres')
  t.equal(rawCalls[0].sql, 'select 1 from pg_database where datname = ?')
  t.same(rawCalls[0].params, ['vestauth_production'])
  t.match(rawCalls[1].sql, /^create database "vestauth_production"$/)
  t.equal(destroyCalls, 1)
})

t.test('does not create database when already exists', async t => {
  mockKnex()
  rawResponses.push({ rows: [{}] })

  const dbCreate = require('../../../src/lib/helpers/dbCreate')
  const result = await dbCreate({ databaseUrl: 'postgres://localhost/vestauth_production' })

  t.same(result, { created: false, database: 'vestauth_production' })
  t.equal(rawCalls.length, 1)
  t.equal(destroyCalls, 1)
})

t.test('throws for missing databaseUrl', async t => {
  mockKnex()
  const dbCreate = require('../../../src/lib/helpers/dbCreate')

  await t.rejects(() => dbCreate(), /missing DATABASE_URL/)
})
