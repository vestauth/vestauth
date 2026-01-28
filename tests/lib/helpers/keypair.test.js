const t = require('tap')
const keypair = require('../../../src/lib/helpers/keypair')

t.test('#keypair', t => {
  const { publicKey, privateKey } = keypair()

  t.type(publicKey, 'object', 'public key is an object')
  t.type(privateKey, 'object', 'private key is an object')

  t.end()
})
