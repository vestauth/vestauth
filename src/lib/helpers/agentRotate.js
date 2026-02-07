const dotenvx = require('@dotenvx/dotenvx')
const keypair = require('./keypair')
const PostRotate = require('../api/postRotate')

async function agentRotate (id, privateJwk, tag = 'web-bot-auth', nonce = null) {
  const envPath = '.env'

  // new keypair
  const newKp = keypair()

  // rotate jwk
  const agent = await new PostRotate(null, newKp.publicJwk, id, privateJwk).run()

  dotenvx.set('AGENT_PUBLIC_JWK', JSON.stringify(newKp.publicJwk), { path: envPath, plain: true, quiet: true })
  dotenvx.set('AGENT_PRIVATE_JWK', JSON.stringify(newKp.privateJwk), { path: envPath, plain: true, quiet: true })

  return {
    AGENT_PUBLIC_JWK: newKp.publicJwk,
    AGENT_ID: agent.uid,
    path: envPath
  }
}

module.exports = agentRotate
