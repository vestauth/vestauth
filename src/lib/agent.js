const agentInit = require('./helpers/agentInit')
const agentHeaders = require('./helpers/agentHeaders')
const hello = require('./helpers/hello')

module.exports = {
  init: agentInit,
  headers: agentHeaders,
  hello
}
