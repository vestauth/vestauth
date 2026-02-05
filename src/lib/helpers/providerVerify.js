const { http } = require('./http')
const buildApiError = require('./buildApiError')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const verifyAgentFqdn = require('./verifyAgentFqdn')
const verify = require('./verify')
const Errors = require('./errors')

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
  const uid = fqdn.split('.')[0]

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

  const signatureInput = headers['Signature-Input'] || headers['signature-input']
  const { values } = parseSignatureInputHeader(signatureInput)
  const kid = values.keyid

  // use publicJwk to verify
  let publicJwk = json.keys[0]
  if (kid) {
    publicJwk = json.keys.find((key) => key.kid === kid)
    if (!publicJwk) {
      throw new Errors().invalidSignature()
    }
  }

  await verify(httpMethod, uri, headers, publicJwk)
  return {
    uid,
    kid,
    public_jwk: publicJwk,
    well_known_url: url
  }
}

module.exports = providerVerify
