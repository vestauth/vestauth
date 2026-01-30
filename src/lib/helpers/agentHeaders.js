const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, tag = 'vestauth', nonce = null, privateKey = null) {
  if (!privateKey) {
    privateKey = identity().privateKey
  }

  return await headers(httpMethod, uri, privateKey, tag, nonce)
}

module.exports = agentHeaders
