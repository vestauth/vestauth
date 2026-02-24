const path = require('path')
const knex = require('knex')
const Errors = require('./errors')
const { logger } = require('../../shared/logger')

function migrationLabel (filename) {
  const base = String(filename).replace(/\.js$/, '')
  const match = base.match(/^(\d+)_(.+)$/)

  if (!match) return base

  const version = match[1]
  const name = match[2]
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  return `${version} ${name}`
}

function formatRailsTiming (ms) {
  return `(${(ms / 1000).toFixed(4)}s)`
}

async function dbMigrate ({ databaseUrl } = {}) {
  const connection = databaseUrl
  if (!connection) throw new Errors().missingDatabaseUrl()

  const db = knex({
    client: 'pg',
    connection,
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: path.resolve(__dirname, '../../server/db/migration')
    }
  })

  try {
    if (!db.migrate || typeof db.migrate.list !== 'function' || typeof db.migrate.up !== 'function') {
      const startedAt = Date.now()
      const [batchNo, migrations] = await db.migrate.latest()
      const elapsedMs = Date.now() - startedAt

      for (const migration of migrations) {
        const label = migrationLabel(migration)
        logger.info(`== ${label}: migrating ================================================`)
        logger.info(`== ${label}: migrated ${formatRailsTiming(elapsedMs)} ===========================`)
      }

      return {
        batchNo,
        migrations
      }
    }

    const [, pending] = await db.migrate.list()
    const migrations = []
    let batchNo = null

    for (const pendingMigration of pending) {
      const name = typeof pendingMigration === 'string'
        ? pendingMigration
        : pendingMigration.file || pendingMigration.name

      const label = migrationLabel(name)
      logger.info(`== ${label}: migrating ================================================`)

      const startedAt = Date.now()
      const [nextBatchNo, ran] = await db.migrate.up({ name })
      batchNo = nextBatchNo
      const elapsedMs = Date.now() - startedAt

      logger.info(`== ${label}: migrated ${formatRailsTiming(elapsedMs)} ===========================`)

      if (Array.isArray(ran)) {
        migrations.push(...ran)
      } else if (ran) {
        migrations.push(ran)
      } else {
        migrations.push(name)
      }
    }

    return {
      batchNo,
      migrations
    }
  } finally {
    await db.destroy()
  }
}

module.exports = dbMigrate
