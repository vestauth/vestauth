const Errors = require('./errors')
const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')
const env = require('./env')

function getAgentDiscoveryDomain () {
  const hostname = (env('AGENT_DISCOVERY_HOSTNAME') || process.env.AGENT_DISCOVERY_HOSTNAME || 'agents.vestauth.com').trim().toLowerCase()
  return hostname.replace(/^https?:\/\//, '').split('/')[0]
}

async function headers (httpMethod, uri, uid, privateJwk, tag = 'web-bot-auth', nonce = null) {
  if (!uid) throw new Errors().missingUid()
  if (!privateJwk) throw new Errors().missingPrivateJwk()

  try {
    privateJwk = JSON.parse(privateJwk)
  } catch {
    throw new Errors().invalidPrivateJwk()
  }
  if (!privateJwk || typeof privateJwk !== 'object') {
    throw new Errors().invalidPrivateJwk()
  }

  const kid = thumbprint(privateJwk)
  privateJwk.kid = kid

  const signatureInput = signatureParams(privateJwk.kid, tag, nonce)
  const signature = webBotAuthSignature(httpMethod, uri, signatureInput, privateJwk)
  const signatureAgent = `${uid}.${getAgentDiscoveryDomain()}` // no scheme; fqdn only

  return {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
    'Signature-Agent': `sig1=${signatureAgent}`
  }
}

module.exports = headers
