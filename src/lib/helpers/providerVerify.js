// const PostVerify = require('../api/postVerify')

async function providerVerify (httpMethod = 'GET', uri = 'https://api.vestauth.com/whoami', headers = {}) {
  const signature = headers.Signature
  const signatureInput = headers['Signature-Input']
  const signatureAgent = headers['Signature-Agent']

  // get well-known jwks

  // const output = await new PostVerify(null, httpMethod, uri, signature, signatureInput).run()
  // return output
}

module.exports = providerVerify
