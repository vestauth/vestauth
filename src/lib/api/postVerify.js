const { http } = require('../helpers/http')
const buildApiError = require('../helpers/buildApiError')

class PostVerify {
  constructor (hostname, providerPublicKey, providerSignature, agentPublicKey, agentSignature) {
    this.hostname = hostname || 'https://api.vestauth.com'
    this.providerPublicKey = providerPublicKey
    this.providerSignature = providerSignature
    this.agentPublicKey = agentPublicKey
    this.agentSignature = agentSignature
  }

  async run () {
    const url = `${this.hostname}/api/agent/verify`
    const providerPublicKey = this.providerPublicKey
    const providerSignature = this.providerSignature
    const agentPublicKey = this.agentPublicKey
    const agentSignature = this.agentSignature

    const resp = await http(url, {
      method: 'POST',
      headers: {
        Authorization: `Agent ${providerPublicKey}:${providerSignature}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_key: agentPublicKey,
        signature: agentSignature
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
