const t = require('tap')

const parseSignatureInputHeader = require('../../../src/lib/helpers/parseSignatureInputHeader')

t.test('#parseSignatureInputHeader - missing header', async t => {
  t.equal(parseSignatureInputHeader(undefined), undefined)
})
