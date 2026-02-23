const t = require('tap')
t.jobs = 1

const databaseUrlPath = require.resolve('../../../src/lib/helpers/databaseUrl')
const envPath = require.resolve('../../../src/lib/helpers/env')

let originalEnvModule

t.beforeEach(() => {
  originalEnvModule = require.cache[envPath]
  delete require.cache[databaseUrlPath]
})

t.afterEach(() => {
  if (originalEnvModule) require.cache[envPath] = originalEnvModule
  else delete require.cache[envPath]

  delete require.cache[databaseUrlPath]
})

t.test('returns DATABASE_URL from env helper when present', t => {
  require.cache[envPath] = {
    exports: (key) => (key === 'DATABASE_URL' ? 'postgres://localhost/custom_db' : null)
  }

  const databaseUrl = require('../../../src/lib/helpers/databaseUrl')

  t.equal(databaseUrl(), 'postgres://localhost/custom_db')
  t.end()
})

t.test('falls back to local postgres url when env helper returns null', t => {
  require.cache[envPath] = {
    exports: () => null
  }

  const databaseUrl = require('../../../src/lib/helpers/databaseUrl')

  t.equal(databaseUrl(), 'postgres://localhost/vestauth_production')
  t.end()
})
