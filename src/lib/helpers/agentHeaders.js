const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, uid = null, privateJwk = null, tag = 'web-bot-auth', nonce = null, hostname = null) {
  if (!privateJwk) {
    privateJwk = identity().privateJwk
  }

  if (!uid) {
    uid = identity().uid
  }

  return await headers(httpMethod, uri, uid, privateJwk, tag, nonce, hostname)
}

module.exports = agentHeaders
