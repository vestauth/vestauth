class Register {
  constructor ({ httpMethod, uri, headers, publicJwk }) {
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
    this.publicJwk = publicJwk
  }

  async run () {
  }
}

module.exports = Register
