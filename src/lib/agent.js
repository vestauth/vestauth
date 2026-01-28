const agentHeaders = require('./helpers/agentHeaders')
const agentInit = require('./helpers/agentInit')
const hello = require('./helpers/hello')

module.exports = {
  init: agentInit,
  headers: agentHeaders,
  hello
}
