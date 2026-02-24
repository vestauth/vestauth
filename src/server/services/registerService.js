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
    const verified = await primitives.verify(
      this.httpMethod,
      this.uri,
      this.headers,
      this.publicJwk
    )

    const agent = await this.models.agent.create().fetch()

    const publicJwk = await this.models.public_jwk.create({
      agent: agent.id,
      kid: verified.kid,
      value: verified.public_jwk
    }).fetch()

    return {
      agent,
      publicJwk,
      verifiedPublicJwk: verified.public_jwk,
      isNew: true
    }
  }
}

module.exports = RegisterService
