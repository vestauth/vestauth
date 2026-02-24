const serverIndex = require('./../../server/index')

function serverStart ({ port, databaseUrl }) {
  return serverIndex.start({ port, databaseUrl })
}

module.exports = serverStart
