const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, tag = 'vestauth', nonce = null, privateKey = null, uid = null) {
  if (!privateKey) {
    privateKey = identity().privateKey
  }

  if (!uid) {
    uid = identity().uid
  }

  return await headers(httpMethod, uri, privateKey, uid, tag, nonce)
}

module.exports = agentHeaders
