const serverIndex = require('./../../server/index')

function serverStart ({ port, hostname, databaseUrl }) {
  return serverIndex.start({ port, hostname, databaseUrl })
}

module.exports = serverStart
