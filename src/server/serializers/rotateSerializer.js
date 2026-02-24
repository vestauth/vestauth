class RotateSerializer {
  constructor ({ agent, publicJwk }) {
    this.agent = agent
    this.publicJwk = publicJwk
  }

  run () {
    const agentFormatted = this.agent.toJSON()

    return {
      uid: agentFormatted.uidFormatted,
      kid: this.publicJwk.kid,
      public_jwk: this.publicJwk.value
    }
  }
}

module.exports = RotateSerializer
