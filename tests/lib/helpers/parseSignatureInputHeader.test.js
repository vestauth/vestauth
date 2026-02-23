const t = require('tap')

const parseSignatureInputHeader = require('../../../src/lib/helpers/parseSignatureInputHeader')

t.test('#parseSignatureInputHeader - missing header', async t => {
  t.same(parseSignatureInputHeader(undefined), {})
  t.same(parseSignatureInputHeader(null), {})
  t.same(parseSignatureInputHeader(''), {})
  t.same(parseSignatureInputHeader('   '), {})
})
