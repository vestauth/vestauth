const agentAuth = require('./helpers/agentAuth')
const agentInit = require('./helpers/agentInit')
const hello = require('./helpers/hello')

module.exports = {
  auth: agentAuth,
  init: agentInit,
  hello
}
