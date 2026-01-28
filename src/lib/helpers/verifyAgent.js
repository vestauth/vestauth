const PostVerify = require('../api/postVerify')
const keypairOld = require('./keypairOld')
const sign = require('./sign')

async function verifyAgent (providerPrivateKey, providerChallenge, authorizationHeader) {
  const kp = keypairOld(providerPrivateKey, 'provider')
  const providerSignature = await sign(providerChallenge, kp.privateKey)

  const raw = authorizationHeader.replace(/^Agent\s+/i, '').trim() // remove 'Agent ' prefix
  const split = String(raw).split(':')
  const agentPublicKey = split[0]
  const agentSignature = split[1]

  const json = await new PostVerify('https://api.vestauth.com', kp.publicKey, providerSignature, agentPublicKey, agentSignature).run()

  return json
}

module.exports = verifyAgent
