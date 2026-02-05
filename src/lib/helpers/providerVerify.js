const { http } = require('./http')
const buildApiError = require('./buildApiError')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const verifyAgentFqdn = require('./verifyAgentFqdn')
const verify = require('./verify')

async function providerVerify (httpMethod, uri, headers = {}) {
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

  const { value } = parseSignatureAgentHeader(signatureAgent) // sig1=agent-1234.agents.vestauth.com
  const fqdn = value
  verifyAgentFqdn(fqdn)
  const origin = `https://${fqdn}` // https://agent-1234.agents.vestauth.com

  // get jwks from .well-known
  const url = `${origin}/.well-known/http-message-signatures-directory` // risk of SSRF ?
  const resp = await http(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
  if (resp.statusCode >= 400) {
    const json = await resp.body.json()
    throw buildApiError(resp.statusCode, json)
  }
  const json = await resp.body.json()

  // example json
  // {
  //   keys: [
  //     {
  //       x: 'IaqY8f2Qp8EpS1qP7AssY0QE4I8PJDwHInLwDfB9WaU',
  //       crv: 'Ed25519',
  //       kid: 'i1B0cEjNvnSBm_TSVS87nqDj7IRfC_Q2eU-SywVxtNI',
  //       kty: 'OKP'
  //     }
  //   ]
  // }

  // use publicJwk to verify
  const publicJwk = json.keys[0]
  return await verify(httpMethod, uri, headers, publicJwk)
}

module.exports = providerVerify
