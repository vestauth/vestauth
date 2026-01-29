const headers = require('./headers')
const dotenvx = require('@dotenvx/dotenvx')

async function agentHeaders (httpMethod, uri, tag = 'vestauth', nonce = null) {
  let publicKey = null
  let privateKey = null
  try { publicKey = dotenvx.get('AGENT_PUBLIC_KEY', { strict: true }) } catch (_e) {}
  try { privateKey = dotenvx.get('AGENT_PRIVATE_KEY', { strict: true }) } catch (_e) {}

  if (!publicKey && !privateKey) throw new Error('missing AGENT_PUBLIC_KEY and AGENT_PRIVATE_KEY. Run [vestauth agent init]')

  return await headers(httpMethod, uri, privateKey, tag, nonce)
}

module.exports = agentHeaders
