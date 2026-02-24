const Waterline = require('waterline')

const protocol = require('./../../lib/helpers/protocol')
const hostname = require('./../../lib/helpers/hostname')

const PublicJwk = Waterline.Collection.extend({
  identity: 'public_jwk',
  tableName: 'public_jwks',
  datastore: 'default',
  primaryKey: 'id',
  schema: true,

  attributes: {
    id: { type: 'number', autoMigrations: { autoIncrement: true } },
    agent: { model: 'agent', columnName: 'agent_id', required: true },
    kid: { type: 'string', required: true },
    value: { type: 'json', required: true },
    state: { type: 'string', required: false },
    createdAt: { columnName: 'created_at', type: 'ref', autoCreatedAt: true },
    updatedAt: { columnName: 'updated_at', type: 'ref', autoUpdatedAt: true }
  },

  beforeCreate (self, next) {
    if (!self.state) {
      self.state = 'active' // default state
    }
    next()
  },

  // customToJSON () {
  //   const self = this

  //   self.uidFormatted = `agent-${self.uid}`
  //   self.wellKnownUrl = `${protocol()}://${self.uidFormatted}.${hostname()}/.well-known/http-message-signatures-directory`
  //   // remove fields if needed
  //   // delete self.privateKey

  //   return self
  // }
})

module.exports = PublicJwk
