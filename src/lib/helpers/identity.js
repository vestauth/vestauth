const env = require('./env')

function identity (raiseError = true) {
  const publicJwk = env('AGENT_PUBLIC_JWK')
  const privateKey = env('AGENT_PRIVATE_KEY')
  const id = env('AGENT_ID')

  if (raiseError && id && !(publicJwk || !privateKey)) throw new Error('missing AGENT_PUBLIC_JWK, AGENT_PRIVATE_KEY, or AGENT_ID. Run [vestauth agent init]')

  return {
    id,
    publicJwk,
    privateKey
  }
}

module.exports = identity
