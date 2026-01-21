const verify = require('./verify')

function verifyAuthorizationHeader (challenge, authorizationHeader) {
  const raw = authorizationHeader.replace(/^Agent\s+/i, '').trim() // remove 'Agent ' prefix
  const split = String(raw).split(':')
  const publicKeyHexPossiblyFormatted = split[0]
  const signatureBase64 = split[1]

  return verify(challenge, signatureBase64, publicKeyHexPossiblyFormatted)
}

module.exports = verifyAuthorizationHeader
