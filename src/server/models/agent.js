const crypto = require('crypto')

const protocol = require('./../../lib/helpers/protocol')
const hostname = require('./../../lib/helpers/hostname')

class AgentRecord {
  constructor (attrs = {}) {
    this.id = attrs.id
    this.uid = attrs.uid
    this.createdAt = attrs.createdAt
    this.updatedAt = attrs.updatedAt
  }

  toJSON () {
    return {
      id: this.id,
      uid: this.uid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      uidFormatted: `agent-${this.uid}`,
      wellKnownUrl: `${protocol()}://agent-${this.uid}.${hostname()}/.well-known/http-message-signatures-directory`
    }
  }
}

class Agent {
  constructor ({ db }) {
    this.db = db
    this.tableName = 'agents'
  }

  async create (attrs = {}) {
    const now = new Date()
    const uid = attrs.uid || crypto.randomBytes(12).toString('hex')

    const [row] = await this.db(this.tableName)
      .insert({
        uid,
        created_at: now,
        updated_at: now
      })
      .returning(['id', 'uid', 'created_at', 'updated_at'])

    return this._fromRow(row)
  }

  async findOne (criteria = {}) {
    const query = this.db(this.tableName)

    if (criteria.id !== undefined) query.where({ id: criteria.id })
    if (criteria.uid !== undefined) query.where({ uid: criteria.uid })

    const row = await query.select(['id', 'uid', 'created_at', 'updated_at']).first()

    if (!row) return null

    return this._fromRow(row)
  }

  _fromRow (row) {
    if (!row) return null

    return new AgentRecord({
      id: Number(row.id),
      uid: row.uid,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })
  }
}

module.exports = Agent
