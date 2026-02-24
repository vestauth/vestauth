const Waterline = require('waterline')
const sailsPostgresAdapter = require('sails-postgresql')

const Agent = require('./agent')
const PublicJwk = require('./publicJwk')

function connectOrm ({ databaseUrl }) {
  const orm = new Waterline()

  // register any models
  orm.registerModel(Agent)
  orm.registerModel(PublicJwk)

  // setup config
  const config = {
    adapters: {
      postgres: sailsPostgresAdapter
    },
    datastores: {
      default: {
        adapter: 'postgres',
        url: databaseUrl,
        migrate: 'safe' // IMPORTANT. instead managed by knex
      }
    }
  }

  return { orm, config }
}

module.exports = { connectOrm }
