const { logger } = require('./../../shared/logger')

const server = require('./../server/index')

function serverStart () {
  server.start()
}

module.exports = serverStart
