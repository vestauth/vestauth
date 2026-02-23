const crypto = require('crypto')

const { http } = require('./http')
const buildApiError = require('./buildApiError')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const stripDictionaryKey = require('./stripDictionaryKey')
const authorityMessage = require('./authorityMessage')
const publicJwkObject = require('./publicJwkObject')
const thumbprint = require('./thumbprint')
const verifyAgentFqdn = require('./verifyAgentFqdn')
const Errors = require('./errors')
const isLocalhost = require('./isLocalhost')

async function resolvePublicJwk ({ signatureInput, signatureAgent, publicJwk }) {
  let uid
  let wellKnownUrl

  const { values } = parseSignatureInputHeader(signatureInput)
  const kid = values.keyid

  if (signatureAgent) {
    const { value } = parseSignatureAgentHeader(signatureAgent)
    const isUri = /^https?:\/\//i.test(value)
    const origin = isUri ? new URL(value).origin : `https://${value}`
    const hostname = new URL(origin).hostname
    if (!isLocalhost(origin)) {
      verifyAgentFqdn(hostname)
    }
    uid = hostname.split('.')[0]
    wellKnownUrl = `${origin}/.well-known/http-message-signatures-directory`
  }

  if (publicJwk) {
    return { uid, kid, publicJwks: [publicJwk], wellKnownUrl }
  }
  if (!signatureAgent) {
    return { publicJwks: null }
  }

  let requestUrl = wellKnownUrl
  const requestHeaders = {}

  const url = new URL(requestUrl)
  if (isLocalhost(wellKnownUrl)) {
    const port = url.port || '80'
    requestUrl = `http://127.0.0.1:${port}${url.pathname}`
    requestHeaders.host = url.host
  }

  const opts = { method: 'GET' }
  if (Object.keys(requestHeaders).length > 0) {
    opts.headers = requestHeaders
  }

  const resp = await http(requestUrl, opts)
  if (resp.statusCode >= 400) {
    const json = await resp.body.json()
    throw buildApiError(resp.statusCode, json)
  }
  const json = await resp.body.json()

  const resolvedPublicJwks = kid
    ? json.keys
      .filter((key) => key.kid === kid || thumbprint(key) === kid)
      .map((key) => (key.kid ? key : { ...key, kid }))
    : json.keys

  if (kid && resolvedPublicJwks.length === 0) {
    throw new Errors().invalidSignature()
  }

  return {
    uid,
    kid,
    publicJwks: resolvedPublicJwks,
    wellKnownUrl
  }
}

async function verify (httpMethod, uri, headers = {}, publicJwk) {
  const signature = headers.Signature || headers.signature
  const signatureInput = headers['Signature-Input'] || headers['signature-input']
  const signatureAgent = headers['Signature-Agent'] || headers['signature-agent']

  const { values } = parseSignatureInputHeader(signatureInput)
  const { expires } = values
  if (expires && expires < (Math.floor(Date.now() / 1000))) {
    throw new Errors().expiredSignature()
  }

  const resolved = await resolvePublicJwk({ signatureInput, signatureAgent, publicJwk })
  if (!Array.isArray(resolved.publicJwks) || resolved.publicJwks.length === 0) {
    throw new Errors().missingPublicJwk()
  }

  const signatureParams = stripDictionaryKey(signatureInput)
  const sig = stripDictionaryKey(signature)
  const message = authorityMessage(uri, signatureParams)

  const verifyWithPublicJwk = (candidatePublicJwk) => crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicJwkObject(candidatePublicJwk),
    Buffer.from(sig, 'base64')
  )

  let matchedPublicJwk
  for (const candidatePublicJwk of resolved.publicJwks) {
    if (verifyWithPublicJwk(candidatePublicJwk)) {
      matchedPublicJwk = candidatePublicJwk
      break
    }
  }
  if (!matchedPublicJwk) throw new Errors().invalidSignature()

  const resolvedKid = resolved.kid || matchedPublicJwk.kid || thumbprint(matchedPublicJwk)
  const resolvedPublicJwk = { ...matchedPublicJwk, kid: resolvedKid }

  const output = {}
  if (resolved.uid) output.uid = resolved.uid
  if (resolvedKid) output.kid = resolvedKid
  output.public_jwk = resolvedPublicJwk
  if (resolved.wellKnownUrl) output.well_known_url = resolved.wellKnownUrl

  return output
}

module.exports = verify
