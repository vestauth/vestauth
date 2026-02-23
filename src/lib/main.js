const agent = require('./agent')
const tool = require('./tool')
const server = require('./server')
const primitives = require('./primitives')

module.exports = {
  agent,
  tool,
  server,
  primitives,

  // deprecate: synonym
  provider: tool
}
