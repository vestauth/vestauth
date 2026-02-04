const env = require('./env')

function identity (raiseError = true) {
  const publicKey = env('AGENT_PUBLIC_KEY')
  const privateKey = env('AGENT_PRIVATE_KEY')
  const id = env('AGENT_ID')

  if (raiseError && id && !(publicKey || !privateKey)) throw new Error('missing AGENT_PUBLIC_KEY,  AGENT_PRIVATE_KEY, or AGENT_ID. Run [vestauth agent init]')

  return {
    id,
    publicKey,
    privateKey
  }
}

module.exports = identity
