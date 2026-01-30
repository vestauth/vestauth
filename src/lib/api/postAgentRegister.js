const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')

class PostAgentRegister {
  constructor (hostname, publicJwk) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.publicJwk = publicJwk
  }

  async run () {
    const url = `${this.hostname}/api/agent/register`
    const publicJwk = this.publicJwk

    const resp = await http(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

module.exports = PostAgentRegister
