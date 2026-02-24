const t = require('tap')
t.jobs = 1

const subdomainBaseHost = require('../../../src/lib/helpers/subdomainBaseHost')

t.test('returns null for missing or empty values', async t => {
  t.equal(subdomainBaseHost(), null)
  t.equal(subdomainBaseHost(null), null)
  t.equal(subdomainBaseHost(''), null)
  t.equal(subdomainBaseHost('   '), null)
})

t.test('extracts hostname from URL inputs and lowercases it', async t => {
  t.equal(subdomainBaseHost('http://LOCALHOST:3000'), 'localhost')
  t.equal(subdomainBaseHost('https://Api.Example.com:4443/path'), 'api.example.com')
})

t.test('handles bare hostname inputs with or without port/path', async t => {
  t.equal(subdomainBaseHost('localhost:3000'), 'localhost')
  t.equal(subdomainBaseHost('api.example.com'), 'api.example.com')
  t.equal(subdomainBaseHost('api.example.com/some/path'), 'api.example.com')
})

t.test('returns null for invalid URL strings when an http scheme is present', async t => {
  t.equal(subdomainBaseHost('http://%%%'), null)
})
