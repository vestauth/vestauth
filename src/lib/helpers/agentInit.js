const dotenvx = require('@dotenvx/dotenvx')
const identity = require('./identity')
const keypair = require('./keypair')
const touch = require('./touch')
const PostRegister = require('../api/postRegister')

async function agentInit () {
  const envPath = '.env'

  // keypair
  const currentPrivateJwk = identity(false).privateJwk
  const kp = keypair(currentPrivateJwk, 'agent')

  touch(envPath)

  // must come before registration so that registration can send headers
  dotenvx.set('AGENT_PUBLIC_JWK', JSON.stringify(kp.publicJwk), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_JWK', JSON.stringify(kp.privateJwk), { path: envPath, plain: true, quiet: true })

  // register agent
  const agent = await new PostRegister(null, kp.publicJwk).run()
  dotenvx.set('AGENT_ID', agent.uid, { path: envPath, plain: true, quiet: true })

  return {
    AGENT_PUBLIC_JWK: kp.publicJwk,
    AGENT_ID: agent.uid,
    path: envPath,
    isNew: agent.is_new
  }
}

module.exports = agentInit
