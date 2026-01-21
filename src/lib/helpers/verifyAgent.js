const PostVerify = require('../api/postVerify')
const keypair = require('./keypair')
const sign = require('./sign')

async function verifyAgent (providerPrivateKey, providerChallenge, agentPublicKey, agentSignature) {
  const kp = keypair(providerPrivateKey, 'provider')
  const providerSignature = await sign(providerChallenge, kp.privateKey)

  const json = await new PostVerify('https://api.vestauth.com', kp.publicKey, providerSignature, agentPublicKey, agentSignature).run()

  return json
}

module.exports = verifyAgent
