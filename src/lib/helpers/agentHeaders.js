const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, id = null, privateJwk = null, tag = 'web-bot-auth', nonce = null) {
  if (!privateJwk) {
    privateJwk = identity().privateJwk
  }

  if (!id) {
    id = identity().id
  }

  return await headers(httpMethod, uri, id, privateJwk, tag, nonce)
}

module.exports = agentHeaders
