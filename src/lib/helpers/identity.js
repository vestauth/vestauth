const env = require('./env')

function identity (raiseError = true) {
  const publicKey = env('AGENT_PUBLIC_KEY')
  const privateKey = env('AGENT_PRIVATE_KEY')

  if (raiseError && !(publicKey || !privateKey)) throw new Error('missing AGENT_PUBLIC_KEY and AGENT_PRIVATE_KEY. Run [vestauth agent init]')

  return {
    publicKey,
    privateKey
  }
}

module.exports = identity
