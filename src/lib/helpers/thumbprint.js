const crypto = require('crypto')

function thumbprint (publicJwk) {
  // RFC 7638 canonical JSON for OKP (Ed25519)
  const canon = `{"crv":"${publicJwk.crv}","kty":"${publicJwk.kty}","x":"${publicJwk.x}"}`
  const sha256 = crypto.createHash('sha256').update(canon).digest()
  return Buffer.from(sha256).toString('base64url')
}

module.exports = thumbprint
