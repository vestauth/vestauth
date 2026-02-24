const t = require('tap')
t.jobs = 1

const resolvePortAndHostname = require('../../../src/lib/helpers/resolvePortAndHostname')

t.test('defaults to localhost:3000 with http when no inputs are provided', async t => {
  t.same(resolvePortAndHostname(), {
    PORT: '3000',
    HOSTNAME: 'http://localhost:3000'
  })
})

t.test('uses provided port and builds localhost hostname with http when hostname is missing', async t => {
  t.same(resolvePortAndHostname({ port: 3001 }), {
    PORT: '3001',
    HOSTNAME: 'http://localhost:3001'
  })
})

t.test('respects explicit hostname when port is not provided', async t => {
  t.same(resolvePortAndHostname({ hostname: 'http://localhost:3000' }), {
    PORT: '3000',
    HOSTNAME: 'http://localhost:3000'
  })
})

t.test('adds https scheme for non-local bare hostnames', async t => {
  t.same(resolvePortAndHostname({ hostname: 'somewebsite.com' }), {
    PORT: '3000',
    HOSTNAME: 'https://somewebsite.com'
  })
})

t.test('preserves explicit http scheme for non-local hostnames', async t => {
  t.same(resolvePortAndHostname({ hostname: 'http://somewebsite.com' }), {
    PORT: '3000',
    HOSTNAME: 'http://somewebsite.com'
  })
})

t.test('uses hostname port when provided in hostname input', async t => {
  t.same(resolvePortAndHostname({ hostname: 'https://api.example.com:4443' }), {
    PORT: '4443',
    HOSTNAME: 'https://api.example.com:4443'
  })
})

t.test('adds resolved port to localhost hostname when hostname has no port', async t => {
  t.same(resolvePortAndHostname({ port: 3002, hostname: 'localhost' }), {
    PORT: '3002',
    HOSTNAME: 'http://localhost:3002'
  })
})
