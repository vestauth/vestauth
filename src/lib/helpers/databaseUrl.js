const env = require('./env')

function databaseUrl () {
  return env('DATABASE_URL') || 'postgres://localhost/vestauth_production'
}

module.exports = databaseUrl
