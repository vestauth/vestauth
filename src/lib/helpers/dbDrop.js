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

async function dbDrop ({ databaseUrl } = {}) {
  const targetUrl = databaseUrl
  const { url, database } = parseConnectionUrl(targetUrl)

  // Connect to the maintenance DB (`postgres`) to drop the target DB.
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

    if (!exists) {
      return { dropped: false, database }
    }

    // Terminate active connections so DROP DATABASE succeeds in local workflows.
    await db.raw(
      'select pg_terminate_backend(pid) from pg_stat_activity where datname = ? and pid <> pg_backend_pid()',
      [database]
    )

    await db.raw(`drop database ${quoteIdentifier(database)}`)
    return { dropped: true, database }
  } finally {
    await db.destroy()
  }
}

module.exports = dbDrop
