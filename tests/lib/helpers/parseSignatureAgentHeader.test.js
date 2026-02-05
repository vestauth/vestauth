const t = require('tap')

const parseSignatureAgentHeader = require('../../../src/lib/helpers/parseSignatureAgentHeader')

t.test('#parseSignatureAgentHeader - parses bare item', async t => {
  const result = parseSignatureAgentHeader('sig1=agent-9aa52a556ca85ee195866c0b.agents.vestauth.com')
  t.same(result, {
    key: 'sig1',
    value: 'agent-9aa52a556ca85ee195866c0b.agents.vestauth.com'
  })
})

t.test('#parseSignatureAgentHeader - parses quoted item', async t => {
  const result = parseSignatureAgentHeader('sig1="agent-9aa52a556ca85ee195866c0b.agents.vestauth.com"')
  t.same(result, {
    key: 'sig1',
    value: 'agent-9aa52a556ca85ee195866c0b.agents.vestauth.com'
  })
})

t.test('#parseSignatureAgentHeader - array header value', async t => {
  const result = parseSignatureAgentHeader(['sig1=agent-9aa52a556ca85ee195866c0b.agents.vestauth.com'])
  t.same(result, {
    key: 'sig1',
    value: 'agent-9aa52a556ca85ee195866c0b.agents.vestauth.com'
  })
})

t.test('#parseSignatureAgentHeader - missing header', async t => {
  t.throws(
    () => parseSignatureAgentHeader(undefined),
    new Error('[INVALID_SIGNATURE_AGENT] invalid --signature-agent')
  )
})
