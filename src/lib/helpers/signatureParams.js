const crypto = require('crypto')

function signatureParams (kid, tag = 'vestauth') {
  const now = new Date()
  const now_plus = new Date(now.getTime() + 300_000) // now + 5 min

  const created = Math.floor(now / 1000)
  const expires = Math.floor(now_plus / 1000)
  const nonce = crypto.randomBytes(64).toString('base64')

  return '("@authority");' +
    `created=${created};` +
    `keyid="${kid}";` +
    'alg="ed25519";' +
    `expires=${expires};` +
    `nonce="${nonce}";` +
    `tag="${tag}"`
}

module.exports = signatureParams
