const t = require('tap')
t.jobs = 1

const helperPath = require.resolve('../../../src/lib/helpers/dbDrop')
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

t.test('drops database when present', async t => {
  mockKnex()
  rawResponses.push({ rows: [{}] }, {}, {})

  const dbDrop = require('../../../src/lib/helpers/dbDrop')
  const result = await dbDrop({ databaseUrl: 'postgres://localhost/vestauth_production' })

  t.same(result, { dropped: true, database: 'vestauth_production' })
  t.equal(knexConfigs[0].connection, 'postgres://localhost/postgres')
  t.equal(rawCalls[0].sql, 'select 1 from pg_database where datname = ?')
  t.match(rawCalls[1].sql, /^select pg_terminate_backend\(pid\)/)
  t.match(rawCalls[2].sql, /^drop database "vestauth_production"$/)
  t.equal(destroyCalls, 1)
})

t.test('does nothing when database is absent', async t => {
  mockKnex()
  rawResponses.push({ rows: [] })

  const dbDrop = require('../../../src/lib/helpers/dbDrop')
  const result = await dbDrop({ databaseUrl: 'postgres://localhost/vestauth_production' })

  t.same(result, { dropped: false, database: 'vestauth_production' })
  t.equal(rawCalls.length, 1)
  t.equal(destroyCalls, 1)
})
