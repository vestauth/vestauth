const dotenvx = require('@dotenvx/dotenvx')
const keypair = require('./keypair')
const touch = require('./touch')

function agentInit () {
  const envPath = '.env'

  // keypair
  let currentPrivateKey = null
  try { currentPrivateKey = dotenvx.get('AGENT_PRIVATE_KEY', { strict: true }) } catch (e) {}

  const kp = keypair(currentPrivateKey, 'agent')

  touch(envPath)

  // place in .env file
  dotenvx.set('AGENT_PUBLIC_KEY', JSON.stringify(kp.publicKey), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_KEY', JSON.stringify(kp.privateKey), { path: envPath, plain: true, quiet: true })

  return {
    AGENT_PUBLIC_KEY: kp.publicKey,
    AGENT_PRIVATE_KEY: kp.privateKey,
    path: envPath
  }
}

module.exports = agentInit
