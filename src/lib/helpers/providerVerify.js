const PostVerify = require('../api/postVerify')

async function providerVerify (httpMethod, uri, signature, signatureInput) {
  const output = await new PostVerify(null, httpMethod, uri, signature, signatureInput).run()

  return output
}

module.exports = providerVerify
