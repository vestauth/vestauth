const { http } = require('./http')
const buildApiError = require('./buildApiError')
const sign = require('./sign')
const dotenvx = require('@dotenvx/dotenvx')

async function agentAuth (website) {
  let publicKey = null
  let privateKey = null
  try { publicKey = dotenvx.get('AGENT_PUBLIC_KEY', { strict: true }) } catch (_e) {}
  try { privateKey = dotenvx.get('AGENT_PRIVATE_KEY', { strict: true }) } catch (_e) {}

  if (!publicKey && !privateKey) throw new Error('missing AGENT_PUBLIC_KEY and AGENT_PRIVATE_KEY. Run [vestauth agent init]')

  let signature
  const url = `${website}/agent/auth`

  if (!signature) {
    const resp = await http(url, {
      method: 'POST',
      headers: {
        Authorization: `Agent ${publicKey}:${signature}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    const json = await resp.body.json()
    const challenge = json.challenge // grab challenge
    signature = await sign(challenge, privateKey)
  }

  const resp = await http(url, {
    method: 'POST',
    headers: {
      Authorization: `Agent ${publicKey}:${signature}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

  if (resp.statusCode >= 400) {
    const json = await resp.body.json()
    return json
  }

  const json = await resp.body.json()
  return json
}

module.exports = agentAuth
