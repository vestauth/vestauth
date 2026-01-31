const dotenvx = require('@dotenvx/dotenvx')
const identity = require('./identity')
const keypair = require('./keypair')
const touch = require('./touch')
const PostRegister = require('../api/postRegister')

async function agentInit () {
  const envPath = '.env'

  // keypair
  const currentPrivateKey = identity(false).privateKey
  const kp = keypair(currentPrivateKey, 'agent')

  touch(envPath)

  dotenvx.set('AGENT_PUBLIC_KEY', JSON.stringify(kp.publicKey), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_KEY', JSON.stringify(kp.privateKey), { path: envPath, plain: true, quiet: true })

  // register agent
  const agent = await new PostRegister(null, kp.publicKey).run()
  dotenvx.set('AGENT_ID', agent.uid, { path: envPath, plain: true, quiet: true })

  return {
    AGENT_PUBLIC_KEY: kp.publicKey,
    AGENT_ID: agent.uid,
    path: envPath
  }
}

module.exports = agentInit
