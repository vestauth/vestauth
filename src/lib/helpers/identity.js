const env = require('./env')

function identity (raiseError = true) {
  const publicKey = env('AGENT_PUBLIC_KEY')
  const privateKey = env('AGENT_PRIVATE_KEY')
  const uid = env('AGENT_ID')

  if (raiseError && uid && !(publicKey || !privateKey)) throw new Error('missing AGENT_PUBLIC_KEY,  AGENT_PRIVATE_KEY, or AGENT_ID. Run [vestauth agent init]')

  return {
    uid,
    publicKey,
    privateKey
  }
}

module.exports = identity
