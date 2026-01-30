const headers = require('./headers')
const identity = require('./identity')

async function agentHeaders (httpMethod, uri, tag = 'vestauth', nonce = null) {
  const { publicKey, privateKey } = identity()

  return await headers(httpMethod, uri, privateKey, tag, nonce)
}

module.exports = agentHeaders
