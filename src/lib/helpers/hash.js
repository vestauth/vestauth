const { sha256 } = require('@noble/hashes/sha2.js')
const { utf8ToBytes } = require('@noble/hashes/utils.js')

function hash (message = 'hello') {
  return sha256(utf8ToBytes(message))
}

module.exports = hash
