const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')
const agentHeaders = require('../helpers/agentHeaders')

class PostRegister {
  constructor (hostname, publicJwk) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.publicJwk = publicJwk
  }

  async run () {
    const url = `${this.hostname}/register`
    const publicJwk = this.publicJwk

    const httpMethod = 'POST'
    const headers = await agentHeaders(httpMethod, url, 'REQUESTING')
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

module.exports = PostRegister
