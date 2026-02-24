const knex = require('knex')

const Agent = require('./agent')
const PublicJwk = require('./publicJwk')

function connectOrm ({ databaseUrl }) {
  const sql = knex({
    client: 'pg',
    connection: databaseUrl
  })

  return {
    sql,
    models: {
      agent: new Agent({ db: sql }),
      public_jwk: new PublicJwk({ db: sql })
    }
  }
}

module.exports = { connectOrm }
