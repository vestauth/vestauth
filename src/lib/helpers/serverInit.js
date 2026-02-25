const dotenvx = require('@dotenvx/dotenvx')
const touch = require('./touch')

async function serverInit ({ port, hostname, databaseUrl }) {
  const envPath = '.env'
  const headerComment = [
    '# [vestauth server start] self-hosted vestauth server',
    '#',
    '# Usage:',
    '# $ vestauth server init --port=3001 --hostname="http://localhost:3001" --database-url="postgresql://USER:PASS@aws-1-us-east-1.pooler.supabase.com:5432/postgres"',
    '#',
    '# PORT: port the server listens on',
    '# HOSTNAME: http://localhost:3000 in dev or https://vestauth.yoursite.com in prod',
    '# DATABASE_URL: postgres://localhost/vestauth_production or a managed Postgres URL',
    '#'
  ].join('\n')

  touch(envPath, headerComment)

  // init server
  dotenvx.set('PORT', port, { path: envPath, plain: false, quiet: true })
  dotenvx.set('HOSTNAME', hostname, { path: envPath, plain: false, quiet: true })
  dotenvx.set('DATABASE_URL', databaseUrl, { path: envPath, plain: false, quiet: true })

  return {
    PORT: port,
    HOSTNAME: hostname,
    DATABASE_URL: databaseUrl,
    path: envPath
  }
}

module.exports = serverInit
