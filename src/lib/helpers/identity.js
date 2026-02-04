const env = require('./env')

function identity (raiseError = true) {
  const publicJwk = env('AGENT_PUBLIC_JWK')
  const privateJwk = env('AGENT_PRIVATE_JWK')
  const id = env('AGENT_ID')

  if (raiseError && id && !(publicJwk || !privateJwk)) throw new Error('missing AGENT_PUBLIC_JWK, AGENT_PRIVATE_JWK, or AGENT_ID. Run [vestauth agent init]')

  return {
    id,
    publicJwk,
    privateJwk
  }
}

module.exports = identity
