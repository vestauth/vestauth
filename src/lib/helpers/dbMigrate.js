const path = require('path')
const knex = require('knex')
const Errors = require('./errors')

async function dbMigrate ({ databaseUrl } = {}) {
  const connection = databaseUrl
  if (!connection) throw new Errors().missingDatabaseUrl()

  const db = knex({
    client: 'pg',
    connection,
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: path.resolve(__dirname, '../../db/migrations')
    }
  })

  try {
    const [batchNo, migrations] = await db.migrate.latest()

    return {
      batchNo,
      migrations
    }
  } finally {
    await db.destroy()
  }
}

module.exports = dbMigrate
