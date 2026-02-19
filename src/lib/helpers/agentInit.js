const dotenvx = require('@dotenvx/dotenvx')
const identity = require('./identity')
const keypair = require('./keypair')
const touch = require('./touch')
const normalizeAgentHostname = require('./normalizeAgentHostname')
const PostRegister = require('../api/postRegister')

async function agentInit (hostname = null) {
  const envPath = '.env'
  const normalizedHostname = normalizeAgentHostname(hostname)
  const shouldPersistHostname = normalizedHostname !== 'https://api.vestauth.com'

  // keypair
  const currentPrivateJwk = identity(false).privateJwk
  const kp = keypair(currentPrivateJwk, 'agent')

  touch(envPath)

  // register agent
  const agent = await new PostRegister(normalizedHostname, kp.publicJwk, kp.privateJwk).run()
  dotenvx.set('AGENT_UID', agent.uid, { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PUBLIC_JWK', JSON.stringify(kp.publicJwk), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_JWK', JSON.stringify(kp.privateJwk), { path: envPath, plain: true, quiet: true })
  if (shouldPersistHostname) {
    dotenvx.set('AGENT_HOSTNAME', normalizedHostname, { path: envPath, plain: true, quiet: true })
  }

  return {
    AGENT_PUBLIC_JWK: kp.publicJwk,
    AGENT_UID: agent.uid,
    path: envPath,
    isNew: agent.is_new
  }
}

module.exports = agentInit
