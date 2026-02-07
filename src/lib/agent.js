const agentInit = require('./helpers/agentInit')
const agentHeaders = require('./helpers/agentHeaders')
const agentRotate = require('./helpers/agentRotate')

module.exports = {
  init: agentInit,
  headers: agentHeaders,
  rotate: agentRotate
}
