const env = require('./env')

function databaseUrl (value) {
  return value || env('DATABASE_URL') || 'postgres://localhost/vestauth_production'
}

module.exports = databaseUrl
