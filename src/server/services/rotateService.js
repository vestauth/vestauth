const primitives = require('./../../lib/primitives')
const parseSignatureInputHeader = require('./../../lib/helpers/parseSignatureInputHeader')

class RotateService {
  constructor ({ models, httpMethod, uri, headers, publicJwk }) {
    this.models = models
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
    this.publicJwk = publicJwk
  }

  async run () {
    const signatureInput = this.headers['Signature-Input'] || this.headers['signature-input']
    const signatureInputValues = parseSignatureInputHeader(signatureInput)

    const kid = signatureInputValues && signatureInputValues.keyid
    if (!kid) throw new Error('kid missing')

    const newKid = this.publicJwk && this.publicJwk.kid
    if (!newKid) throw new Error('new kid missing')

    const currentPublicJwk = await this.models.public_jwk.findOne({ kid })
    if (!currentPublicJwk) throw new Error('public_jwk not found')

    await primitives.verify(this.httpMethod, this.uri, this.headers, currentPublicJwk.value)

    const agent = await this.models.agent.findOne({ id: currentPublicJwk.agent })
    if (!agent) throw new Error('agent not found')

    await this.models.public_jwk.db.transaction(async (trx) => {
      const existingNewPublicJwk = await trx('public_jwks')
        .select(['id', 'agent_id', 'kid'])
        .where({ kid: newKid })
        .first()

      if (existingNewPublicJwk && Number(existingNewPublicJwk.agent_id) !== agent.id) {
        throw new Error('new kid already belongs to another agent')
      }

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

      await trx('public_jwks')
        .where({ id: currentPublicJwk.id })
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
