const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, id = null, privateKey = null, tag = 'web-bot-auth', nonce = null) {
  if (!privateKey) {
    privateKey = identity().privateKey
  }

  if (!id) {
    id = identity().id
  }

  return await headers(httpMethod, uri, id, privateKey, tag, nonce)
}

module.exports = agentHeaders
