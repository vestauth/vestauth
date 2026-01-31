const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')

class PostVerify {
  constructor (hostname, httpMethod, uri, signature, signatureInput) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.httpMethod = httpMethod
    this.uri = uri
    this.signature = signature
    this.signatureInput = signatureInput
  }

  async run () {
    const url = `${this.hostname}/verify`
    const httpMethod = this.httpMethod
    const uri = this.uri
    const signature = this.signature
    const signatureInput = this.signatureInput

    const headers = {
      'Content-Type': 'application/json'
    }

    const resp = await http(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        http_method: httpMethod,
        uri,
        signature,
        signature_input: signatureInput
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

module.exports = PostVerify
