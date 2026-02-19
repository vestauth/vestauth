const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')
const agentHeaders = require('../helpers/agentHeaders')

class PostRegister {
  constructor (hostname, publicJwk, privateJwk) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.publicJwk = publicJwk
    this.privateJwk = privateJwk
  }

  async run () {
    const hostname = this.hostname
    const url = `${hostname}/register`
    const publicJwk = this.publicJwk
    const privateJwk = this.privateJwk

    const httpMethod = 'POST'
    const headers = await agentHeaders(httpMethod, url, 'REGISTERING', JSON.stringify(privateJwk), null, null, hostname)
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
