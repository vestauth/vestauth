const { parseDictionary } = require('structured-headers')
const Errors = require('./errors')

// example: sig1=agent-9aa52a556ca85ee195866c0b.agents.vestauth.com
function parseSignatureAgentHeader (signatureAgentHeader) {
  const dictionary = parseDictionary(signatureAgentHeader)
  const entry = dictionary.entries().next()
  if (entry.done) throw new Errors().invalidSignatureAgent()
  const [key, member] = entry.value
  let value
  if (typeof member === 'string') {
    value = member
  } else if (member && typeof member === 'object' && 'value' in member) {
    value = member.value
  } else if (Array.isArray(member) && typeof member[0] === 'string') {
    value = member[0]
  } else if (Array.isArray(member) && member[0] && typeof member[0] === 'object' && 'value' in member[0]) {
    value = member[0].value
  }
  if (!value) throw new Errors().invalidSignatureAgent()

  return {
    key,
    value
  }
}

module.exports = parseSignatureAgentHeader
