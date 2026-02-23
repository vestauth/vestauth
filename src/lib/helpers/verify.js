const crypto = require('crypto')

const { http } = require('./http')
const buildApiError = require('./buildApiError')
const parseSignatureAgentHeader = require('./parseSignatureAgentHeader')
const parseSignatureInputHeader = require('./parseSignatureInputHeader')
const stripDictionaryKey = require('./stripDictionaryKey')
const authorityMessage = require('./authorityMessage')
const publicJwkObject = require('./publicJwkObject')
const verifyAgentFqdn = require('./verifyAgentFqdn')
const Errors = require('./errors')
const isLocalhost = require('./isLocalhost')

async function resolvePublicJwk ({ signatureInput, signatureAgent, publicJwk }) {
  let uid
  let wellKnownUrl

  const values = parseSignatureInputHeader(signatureInput)
  if (!values) {
    throw new Errors().missingSignatureInput()
  }

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
    return { uid, kid, publicJwk, wellKnownUrl }
  }
  if (!signatureAgent) {
    return { publicJwk: null }
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

  let resolvedPublicJwk = json.keys[0]
  if (kid) {
    resolvedPublicJwk = json.keys.find((key) => key.kid === kid)
    if (!resolvedPublicJwk) {
      throw new Errors().invalidSignature()
    }
  }

  return {
    uid,
    kid,
    publicJwk: resolvedPublicJwk,
    wellKnownUrl
  }
}

async function verify (httpMethod, uri, headers = {}, publicJwk) {
  const signature = headers.Signature || headers.signature
  const signatureInput = headers['Signature-Input'] || headers['signature-input']
  const signatureAgent = headers['Signature-Agent'] || headers['signature-agent']

  const values = parseSignatureInputHeader(signatureInput)
  if (!values) {
    throw new Errors().missingSignatureInput()
  }

  const { expires } = values
  if (expires && expires < (Math.floor(Date.now() / 1000))) {
    throw new Errors().expiredSignature()
  }

  const resolved = await resolvePublicJwk({ signatureInput, signatureAgent, publicJwk })
  if (!resolved.publicJwk) {
    throw new Errors().missingPublicJwk()
  }

  const signatureParams = stripDictionaryKey(signatureInput)
  const sig = stripDictionaryKey(signature)
  const message = authorityMessage(uri, signatureParams)

  const success = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicJwkObject(resolved.publicJwk),
    Buffer.from(sig, 'base64')
  )

  if (!success) {
    throw new Errors().invalidSignature()
  }

  const output = {}
  if (resolved.uid) output.uid = resolved.uid
  if (resolved.kid) output.kid = resolved.kid
  if (resolved.publicJwk) output.public_jwk = resolved.publicJwk
  if (resolved.wellKnownUrl) output.well_known_url = resolved.wellKnownUrl

  return output
}

module.exports = verify
