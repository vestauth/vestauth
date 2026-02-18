const agent = require('./agent')
const tool = require('./tool')
const primitives = require('./primitives')

module.exports = {
  agent,
  tool,
  primitives,

  // deprecate: synonym
  provider: tool
}
