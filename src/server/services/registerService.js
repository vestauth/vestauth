const primitives = require('./../../lib/primitives')

class RegisterService {
  constructor ({ models, httpMethod, uri, headers, publicJwk }) {
    this.models = models
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
    this.publicJwk = publicJwk
  }

  async run () {
    // this is a special case where this is NOT a tool
    // don't send the signature-agent header on register?
    this.verified = await primitives.verify(
      this.httpMethod,
      this.uri,
      this.headers,
      this.publicJwk
    )

    const existingPublicJwk = await this.models.public_jwk.findOne({ kid: this.verified.kid })
    if (existingPublicJwk) {
      const agent = await this.models.agent.findOne({ id: existingPublicJwk.agent })
      if (!agent) {
        throw new Error('agent not found for public_jwk')
      }

      return {
        agent,
        publicJwk: existingPublicJwk.value,
        isNew: false
      }
    }

    const agent = await this.models.agent.create()
    const createdPublicJwk = await this.models.public_jwk.create({
      agent: agent.id,
      kid: this.verified.kid,
      value: this.verified.public_jwk
    })

    return {
      agent,
      publicJwk: createdPublicJwk.value,
      isNew: true
    }
  }
}

module.exports = RegisterService
