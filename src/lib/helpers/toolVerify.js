const verify = require('./verify')
const Errors = require('./errors')

async function toolVerify (httpMethod, uri, headers = {}) {
  if (!httpMethod) {
    throw new Errors().missingHttpMethod()
  }
  if (!uri) {
    throw new Errors().missingUri()
  }

  const signatureAgent = headers['Signature-Agent'] || headers['signature-agent'] // support either case (expressjs lowers headers)
  if (!signatureAgent) {
    throw new Errors().missingSignatureAgent()
  }

  return verify(httpMethod, uri, headers)
}

module.exports = toolVerify
