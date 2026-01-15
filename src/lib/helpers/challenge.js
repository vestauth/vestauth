const crypto = require('crypto')

function challenge () {
  return crypto.randomBytes(32).toString('base64url')
}

module.exports = challenge
