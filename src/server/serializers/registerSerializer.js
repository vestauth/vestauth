class RegisterSerializer {
  constructor ({ agent, publicJwk, isNew }) {
    this.agent = agent
    this.publicJwk = publicJwk
    this.isNew = isNew
  }

  run () {
    const agentFormatted = this.agent.toJSON()

    return {
      uid: agentFormatted.uidFormatted,
      kid: this.publicJwk.kid,
      public_jwk: this.publicJwk,
      is_new: Boolean(this.isNew)
    }
  }
}

module.exports = RegisterSerializer
