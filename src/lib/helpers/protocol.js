const env = require('./env')

function protocol () {
  return env('PROTOCOL') || 'http'
}

module.exports = protocol
