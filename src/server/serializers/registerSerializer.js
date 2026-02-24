class RegisterSerializer {
  constructor ({ agent, publicJwk, verifiedPublicJwk, isNew }) {
    this.agent = agent
    this.publicJwk = publicJwk
    this.verifiedPublicJwk = verifiedPublicJwk
    this.isNew = isNew
  }

  run () {
    const agentFormatted = this.agent.toJSON()

    return {
      uid: agentFormatted.uidFormatted,
      kid: this.publicJwk.kid,
      public_jwk: this.verifiedPublicJwk,
      is_new: Boolean(this.isNew)
    }
  }
}

module.exports = RegisterSerializer
