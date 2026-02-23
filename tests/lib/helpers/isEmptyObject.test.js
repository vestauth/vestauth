const t = require('tap')

const isEmptyObject = require('../../../src/lib/helpers/isEmptyObject')

t.test('#isEmptyObject', async t => {
  t.equal(isEmptyObject({}), true)
  t.equal(isEmptyObject({ a: 1 }), false)
  t.equal(isEmptyObject(null), false)
  t.equal(isEmptyObject(undefined), false)
  t.equal(isEmptyObject([]), false)
  t.equal(isEmptyObject(''), false)
})
