const { parseDictionary } = require('structured-headers')

// example: sig1=https://agent-9aa52a556ca85ee195866c0b.agents.vestauth.com
function parseSignatureAgentHeader (signatureAgentHeader) {
  const dictionary = parseDictionary(signatureAgentHeader)
  const entry = dictionary.entries().next()
  if (entry.done) throw new Error('Invalid Signature-Agent header: empty dictionary')
  const [key, innerlist] = entry.value
  const value = innerlist[0].value
  if (!value) throw new Error('Invalid Signature-Agent header: expected a URL string')

  return {
    key,
    value
  }
}

module.exports = parseSignatureAgentHeader
