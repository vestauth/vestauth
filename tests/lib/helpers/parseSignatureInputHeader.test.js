const t = require('tap')

const parseSignatureInputHeader = require('../../../src/lib/helpers/parseSignatureInputHeader')

t.test('#parseSignatureInputHeader - missing header', async t => {
  t.same(parseSignatureInputHeader(undefined), {
    key: undefined,
    values: {},
    components: []
  })
})
