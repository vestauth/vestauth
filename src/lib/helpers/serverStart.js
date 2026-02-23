const serverIndex = require('./../server/index')

function serverStart ({ port }) {
  serverIndex.start({ port })
}

module.exports = serverStart
