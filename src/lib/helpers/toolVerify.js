const verify = require('./verify')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const extractHostAndHostname = require('./extractHostAndHostname')
const trustedFqdn = require('./trustedFqdn')
const Errors = require('./errors')


async function toolVerify (httpMethod, uri, headers = {}) {
  if (!httpMethod) {
    throw new Errors().missingHttpMethod()
  }
  if (!uri) {
    throw new Errors().missingUri()
  }

  const signatureAgent = headers['Signature-Agent'] || headers['signature-agent'] // support either case (expressjs downcases headers)
  if (!signatureAgent) {
    throw new Errors().missingSignatureAgent()
  }

  const { value } = parseSignatureAgentHeader(signatureAgent)
  if (!value) {
    throw new Errors().invalidSignatureAgent()
  }

  const { host } = extractHostAndHostname(value)
  const fqdn = host
  if (!fqdn) {
    throw new Errors().invalidSignatureAgent()
  }

  // handles .api.vestauth.com, .HOSTNAME, and TOOL_FQDN_REGEX override
  const serverHostname = 'http://localhost:3000'
  if (!trustedFqdn(fqdn, serverHostname)) {
    throw new Errors().untrustedSignatureAgent()
  }

  return verify(httpMethod, uri, headers)
}

module.exports = toolVerify
