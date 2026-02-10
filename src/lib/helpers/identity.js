const env = require('./env')

function identity (raiseError = true) {
  const publicJwk = env('AGENT_PUBLIC_JWK')
  const privateJwk = env('AGENT_PRIVATE_JWK')
  const uid = env('AGENT_UID') || env('AGENT_ID')

  if (raiseError && uid && !(publicJwk || !privateJwk)) throw new Error('missing AGENT_PUBLIC_JWK, AGENT_PRIVATE_JWK, or AGENT_UID. Run [vestauth agent init]')

  return {
    uid,
    publicJwk,
    privateJwk
  }
}

module.exports = identity
