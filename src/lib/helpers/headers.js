const Errors = require('./errors')
const thumbprint = require('./thumbprint')
const signatureParams = require('./signatureParams')
const webBotAuthSignature = require('./webBotAuthSignature')
const env = require('./env')

function getAgentDiscoveryDomain (hostname = null) {
  if (!hostname) {
    hostname = (env('AGENT_HOSTNAME') || process.env.AGENT_HOSTNAME || 'api.vestauth.com').trim().toLowerCase()
  }

  // this is NOT set yet on the very first init call
  return hostname.replace(/^https?:\/\//, '').split('/')[0]
}

async function headers (httpMethod, uri, uid, privateJwk, tag = 'web-bot-auth', nonce = null, hostname = null) {
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
  const signatureAgent = `${uid}.${getAgentDiscoveryDomain(hostname)}` // no scheme; fqdn only

  return {
    Signature: `sig1=:${signature}:`,
    'Signature-Input': `sig1=${signatureInput}`,
    'Signature-Agent': `sig1=${signatureAgent}`
  }
}

module.exports = headers
