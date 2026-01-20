const t = require('tap')

const challenge = require('../../../src/lib/helpers/challenge')

t.test('#challenge', ct => {
  const a = challenge()
  const b = challenge()

  t.type(a, 'string', 'returns a string')
  t.not(a, b, 'generates unique values')

  // base64url chars only
  t.match(a, /^[A-Za-z0-9_-]+$/, 'is base64url-safe')

  // 32 bytes → 43 chars in base64url (no padding)
  t.equal(a.length, 43, 'has expected length')

  ct.end()
})
