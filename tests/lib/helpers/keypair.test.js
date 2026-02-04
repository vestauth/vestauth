const t = require('tap')
const keypair = require('../../../src/lib/helpers/keypair')

t.test('#keypair', t => {
  const { publicJwk, privateJwk } = keypair()

  t.type(publicJwk, 'object', 'public JWK is an object')
  t.type(privateJwk, 'object', 'private JWK is an object')

  t.end()
})
