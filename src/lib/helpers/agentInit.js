const dotenvx = require('@dotenvx/dotenvx')
const identity = require('./identity')
const keypair = require('./keypair')
const touch = require('./touch')
const PostAgentRegister = require('../api/postAgentRegister')

async function agentInit () {
  const envPath = '.env'

  // keypair
  const currentPrivateKey = identity(false).privateKey
  const kp = keypair(currentPrivateKey, 'agent')

  touch(envPath)

  // place in .env file
  dotenvx.set('AGENT_PUBLIC_KEY', JSON.stringify(kp.publicKey), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_KEY', JSON.stringify(kp.privateKey), { path: envPath, plain: true, quiet: true })

  // register agent with api
  await new PostAgentRegister(null, kp.publicKey).run()

  return {
    AGENT_PUBLIC_KEY: kp.publicKey,
    AGENT_PRIVATE_KEY: kp.privateKey,
    path: envPath
  }
}

module.exports = agentInit
