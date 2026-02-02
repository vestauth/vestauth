const t = require('tap')

const thumbprint = require('../../../src/lib/helpers/thumbprint')

t.test('#thumbprint - known JWK', t => {
  const publicJwk = {
    crv: 'Ed25519',
    kty: 'OKP',
    x: '11qYAYdk9RjXNE4sG6oIYx5t5p0qG6oP1Y8Y9R8k6vA'
  }

  const result = thumbprint(publicJwk)

  t.equal(result, 'imyboX67iEWId-FacuZA25nxHr8WsOwo5Yz2z-zAK6w')

  t.end()
})

t.test('#thumbprint - different x yields different value', t => {
  const baseJwk = {
    crv: 'Ed25519',
    kty: 'OKP',
    x: '11qYAYdk9RjXNE4sG6oIYx5t5p0qG6oP1Y8Y9R8k6vA'
  }

  const resultA = thumbprint(baseJwk)
  const resultB = thumbprint({ ...baseJwk, x: 'AAqYAYdk9RjXNE4sG6oIYx5t5p0qG6oP1Y8Y9R8k6vA' })

  t.not(resultA, resultB)

  t.end()
})

t.test('#thumbprint - null publicKey', t => {
  const result = thumbprint(null)

  t.equal(result, 'OkI_FFkdwHoj0WRjTTr_VHKxqbfmfVIHvLe85dQGFOk')

  t.end()
})

t.test('#thumbprint - empty string publicKey', t => {
  const result = thumbprint('')

  t.equal(result, 'OkI_FFkdwHoj0WRjTTr_VHKxqbfmfVIHvLe85dQGFOk')

  t.end()
})
