const { sha256 } = rquire('@noble/hashes/sha256')
const { utf8ToBytes } = require('@noble/hashes/utils')

function hash (message = 'hello') {
  return sha256(utf8ToBytes(message))
}

module.exports = hash
