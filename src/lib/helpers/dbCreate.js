const knex = require('knex')

function quoteIdentifier (value) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function parseConnectionUrl (value) {
  if (!value) throw new Error('missing DATABASE_URL')

  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error('invalid DATABASE_URL')
  }

  const database = decodeURIComponent((url.pathname || '').replace(/^\//, ''))
  if (!database) throw new Error('missing database name in DATABASE_URL')

  return { url, database }
}

async function dbCreate ({ databaseUrl } = {}) {
  const targetUrl = databaseUrl || process.env.DATABASE_URL || 'postgres://localhost/vestauth_production'
  const { url, database } = parseConnectionUrl(targetUrl)

  // Connect to the maintenance DB (`postgres`) to create the target DB.
  const maintenanceUrl = (() => {
    const copy = new URL(url.toString())
    copy.pathname = '/postgres'
    return copy.toString()
  })()

  const db = knex({
    client: 'pg',
    connection: maintenanceUrl
  })

  try {
    const result = await db.raw('select 1 from pg_database where datname = ?', [database])
    const exists = Array.isArray(result.rows) && result.rows.length > 0

    if (exists) {
      return { created: false, database }
    }

    await db.raw(`create database ${quoteIdentifier(database)}`)
    return { created: true, database }
  } finally {
    await db.destroy()
  }
}

module.exports = dbCreate
