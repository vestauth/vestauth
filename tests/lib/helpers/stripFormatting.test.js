const t = require('tap')

const stripFormatting = require('../../../src/lib/helpers/stripFormatting')

t.test('#stripFormatting', ct => {
  const privateKey = 'agent_pub_2c93601cba85b3b2474817897826ebef977415c097f0bf57dcbaa3056e5d64d0'

  const result = stripFormatting(privateKey)

  ct.equal(result, '2c93601cba85b3b2474817897826ebef977415c097f0bf57dcbaa3056e5d64d0')

  ct.end()
})
