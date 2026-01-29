const headers = require('./headers')
const dotenvx = require('@dotenvx/dotenvx')
const { verify } = require('web-bot-auth')
const { verifierFromJWK } = require('web-bot-auth/crypto')

async function agentHeaders (httpMethod, uri, tag = 'vestauth', nonce = null) {
  let publicKey = null
  let privateKey = null
  try { publicKey = dotenvx.get('AGENT_PUBLIC_KEY', { strict: true }) } catch (_e) {}
  try { privateKey = dotenvx.get('AGENT_PRIVATE_KEY', { strict: true }) } catch (_e) {}

  if (!publicKey && !privateKey) throw new Error('missing AGENT_PUBLIC_KEY and AGENT_PRIVATE_KEY. Run [vestauth agent init]')

  const _headers = await headers(httpMethod, uri, privateKey, tag, nonce)

  // verification (temp testing)
  const verifier = await verifierFromJWK(JSON.parse(publicKey))
  const signedRequest = new Request(uri, { headers: _headers })
  const r = await verify(signedRequest, verifier)
  console.log(r)

  return _headers
}

module.exports = agentHeaders
