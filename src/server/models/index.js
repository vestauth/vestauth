const knex = require('knex')

const Agent = require('./agent')
const PublicJwk = require('./publicJwk')

function connectOrm ({ databaseUrl }) {
  const db = knex({
    client: 'pg',
    connection: databaseUrl
  })

  return {
    db,
    models: {
      agent: new Agent({ db }),
      public_jwk: new PublicJwk({ db })
    }
  }
}

module.exports = { connectOrm }
