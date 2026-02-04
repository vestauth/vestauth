const { http } = require('./http')
const buildApiError = require('./buildApiError')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const verify = require('./verify')

async function providerVerify (httpMethod, uri, headers = {}) {
  const signatureAgent = headers['Signature-Agent']
  const { value } = parseSignatureAgentHeader(signatureAgent) // sig1=https://agent-9aa52a556ca85ee195866c0b.agents.vestauth.com

  const url = `${value}/.well-known/http-message-signatures-directory` // risk of SSRF ?
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
  const publicJwk = json.keys[0]
  const output = await verify(httpMethod, uri, headers, publicJwk)

  return output
}

module.exports = providerVerify
