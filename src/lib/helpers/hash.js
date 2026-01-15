const { sha256 } = require('@noble/hashes/sha2.js')
const { utf8ToBytes } = require('@noble/hashes/utils.js')

function hash (str = '') {
  return sha256(utf8ToBytes(str))
}

module.exports = hash
