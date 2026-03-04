const env = require('./env')

function toolIdentity (raiseError = true) {
  const publicJwk = env('TOOL_PUBLIC_JWK')
  const privateJwk = env('TOOL_PRIVATE_JWK')
  const uid = env('TOOL_UID')

  if (raiseError && uid && !(publicJwk && privateJwk)) throw new Error('missing TOOL_PUBLIC_JWK, TOOL_PRIVATE_JWK, or TOOL_UID. Run [vestauth tool init]')

  return {
    uid,
    publicJwk,
    privateJwk
  }
}

module.exports = toolIdentity
