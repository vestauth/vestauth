const env = require('./env')

function hostname () {
  return env('HOSTNAME') || 'localhost:3000' // for server
}

module.exports = hostname
