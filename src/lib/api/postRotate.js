const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')
const agentHeaders = require('../helpers/agentHeaders')

class PostRotate {
  constructor (hostname, publicJwk, id, privateJwk) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.publicJwk = publicJwk // new publicJwk

    this.id = id
    this.privateJwk = privateJwk
  }

  async run () {
    const url = `${this.hostname}/rotate`
    const publicJwk = this.publicJwk
    const id = this.id
    const privateJwk = this.privateJwk

    const httpMethod = 'POST'
    const headers = await agentHeaders(httpMethod, url, id, privateJwk)
    headers['Content-Type'] = 'application/json'

    const resp = await http(url, {
      method: httpMethod,
      headers,
      body: JSON.stringify({
        public_jwk: publicJwk
      })
    })

    if (resp.statusCode >= 400) {
      const json = await resp.body.json()
      throw buildApiError(resp.statusCode, json)
    }

    const json = await resp.body.json()
    return json
  }
}

module.exports = PostRotate
