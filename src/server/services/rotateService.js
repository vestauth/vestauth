const tool = require('./../../lib/tool')

class RotateService {
  constructor ({ models, httpMethod, uri, headers, publicJwk, serverHostname }) {
    this.models = models
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
    this.publicJwk = publicJwk
    this.serverHostname = serverHostname
  }

  async run () {
    const remoteAgent = await tool.verify(this.httpMethod, this.uri, this.headers, this.serverHostname)
    // uid: 'agent-6d2140af72bcefcedd4b44ab',
    // kid: 'Tx3W50MU5wMQ5I77z5DUGtbcs3ZPLlxfWx14pzpo5Fo',
    // public_jwk: {
    //   x: 'i5lNVLWHdyCoAimbFpyE7Z8UXtHl4AVQSnxCVlc2zkU',
    //   crv: 'Ed25519',
    //   kid: 'Tx3W50MU5wMQ5I77z5DUGtbcs3ZPLlxfWx14pzpo5Fo',
    //   kty: 'OKP'
    // },
    // well_known_url: 'http://agent-6d2140af72bcefcedd4b44ab.localhost:3000/.well-known/http-message-signatures-directory'

    // grab new kid for later
    const newKid = this.publicJwk && this.publicJwk.kid
    if (!newKid) throw new Error('new kid missing')

    // find the public_jwk by the remoteAgent.kid
    const publicJwkRecord = await this.models.public_jwk.findOne({ kid: remoteAgent.kid })
    if (!publicJwkRecord) throw new Error('public_jwk not found')

    // find agent
    const agent = await this.models.agent.findOne({ id: publicJwkRecord.agent })
    if (!agent) throw new Error('agent not found')

    // place in transaction
    await this.models.public_jwk.db.transaction(async (trx) => {
      const existingNewPublicJwk = await trx('public_jwks')
        .select(['id', 'agent_id', 'kid'])
        .where({ kid: newKid })
        .first()

      if (existingNewPublicJwk && Number(existingNewPublicJwk.agent_id) !== agent.id) {
        throw new Error('new kid already belongs to another agent')
      }

      // create new
      if (!existingNewPublicJwk) {
        const now = new Date()
        await trx('public_jwks').insert({
          agent_id: agent.id,
          kid: newKid,
          value: this.publicJwk,
          state: 'active',
          created_at: now,
          updated_at: now
        })
      }

      // revoke old
      await trx('public_jwks')
        .where({ id: publicJwkRecord.id })
        .update({
          state: 'revoked',
          updated_at: new Date()
        })
    })

    const rotatedPublicJwk = await this.models.public_jwk.findOne({ kid: newKid })
    if (!rotatedPublicJwk) throw new Error('rotated public_jwk not found')

    return {
      agent,
      publicJwk: rotatedPublicJwk
    }
  }
}

module.exports = RotateService
