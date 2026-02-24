class PublicJwkRecord {
  constructor (attrs = {}) {
    this.id = attrs.id
    this.agent = attrs.agent
    this.kid = attrs.kid
    this.value = attrs.value
    this.state = attrs.state
    this.createdAt = attrs.createdAt
    this.updatedAt = attrs.updatedAt
  }

  toJSON () {
    return {
      id: this.id,
      agent: this.agent,
      kid: this.kid,
      value: this.value,
      state: this.state,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

class PublicJwk {
  constructor ({ db }) {
    this.db = db
    this.tableName = 'public_jwks'
  }

  async create (attrs = {}) {
    const now = new Date()
    const rowToInsert = {
      agent_id: attrs.agent,
      kid: attrs.kid,
      value: attrs.value,
      state: attrs.state || 'active',
      created_at: now,
      updated_at: now
    }

    const [row] = await this.db(this.tableName)
      .insert(rowToInsert)
      .returning(['id', 'agent_id', 'kid', 'value', 'state', 'created_at', 'updated_at'])

    return this._fromRow(row)
  }

  async find (criteria = {}) {
    const query = this.db(this.tableName)

    if (criteria.id !== undefined) query.where({ id: criteria.id })
    if (criteria.agent !== undefined) query.where({ agent_id: criteria.agent })
    if (criteria.kid !== undefined) query.where({ kid: criteria.kid })
    if (criteria.state !== undefined) query.where({ state: criteria.state })

    const rows = await query.select(['id', 'agent_id', 'kid', 'value', 'state', 'created_at', 'updated_at'])

    return rows.map((row) => this._fromRow(row))
  }

  async findOne (criteria = {}) {
    const query = this.db(this.tableName)

    if (criteria.id !== undefined) query.where({ id: criteria.id })
    if (criteria.agent !== undefined) query.where({ agent_id: criteria.agent })
    if (criteria.kid !== undefined) query.where({ kid: criteria.kid })
    if (criteria.state !== undefined) query.where({ state: criteria.state })

    const row = await query
      .select(['id', 'agent_id', 'kid', 'value', 'state', 'created_at', 'updated_at'])
      .first()

    if (!row) return null

    return this._fromRow(row)
  }

  _fromRow (row) {
    if (!row) return null

    return new PublicJwkRecord({
      id: Number(row.id),
      agent: Number(row.agent_id),
      kid: row.kid,
      value: row.value,
      state: row.state,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })
  }
}

module.exports = PublicJwk
