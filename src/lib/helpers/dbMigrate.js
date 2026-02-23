const path = require('path')
const knex = require('knex')

async function dbMigrate ({ databaseUrl } = {}) {
  const connection = databaseUrl

  const db = knex({
    client: 'pg',
    connection,
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
