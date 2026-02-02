const crypto = require('crypto')

function thumbprint (publicJwk) {
  // RFC 7638 canonical JSON for OKP (Ed25519)
  const jwk = publicJwk && typeof publicJwk === 'object' ? publicJwk : {}
  const crv = jwk.crv || ''
  const kty = jwk.kty || ''
  const x = jwk.x || ''
  const canon = `{"crv":"${crv}","kty":"${kty}","x":"${x}"}`
  const sha256 = crypto.createHash('sha256').update(canon).digest()
  return Buffer.from(sha256).toString('base64url')
}

module.exports = thumbprint
