const crypto = require('crypto')

const epoch = require('./epoch')

function signatureParams (kid, tag = 'web-bot-auth', nonce = null) {
  const { created, expires } = epoch()

  if (!nonce) nonce = crypto.randomBytes(64).toString('base64url')

  return '("@authority");' +
    `created=${created};` +
    `keyid="${kid}";` +
    'alg="ed25519";' +
    `expires=${expires};` +
    `nonce="${nonce}";` +
    `tag="${tag}"`
}

module.exports = signatureParams
