const crypto = require('crypto')
const Waterline = require('waterline')

const protocol = require('./../../helpers/protocol')
const hostname = require('./../../helpers/hostname')

const Agent = Waterline.Collection.extend({
  identity: 'agent',
  tableName: 'agents',
  datastore: 'default',
  primaryKey: 'id',
  schema: true,

  attributes: {
    id: { type: 'number', autoMigrations: { autoIncrement: true } },
    uid: { type: 'string', required: false },
    createdAt: { columnName: 'created_at', type: 'ref', autoCreatedAt: true },
    updatedAt: { columnName: 'updated_at', type: 'ref', autoUpdatedAt: true }
  },

  beforeCreate(self, next) {
    if (!self.uid) {
      const uid = crypto.randomBytes(12).toString('hex')
      self.uid = uid
    }
    next()
  },

  customToJSON() {
    const self = this

    self.uidFormatted = `agent-${self.uid}`
    self.wellKnownUrl = `${protocol()}://${self.uidFormatted}.${hostname()}/.well-known/http-message-signatures-directory`
    // remove fields if needed
    // delete self.privateKey

    return self
  }
})

module.exports = Agent;
