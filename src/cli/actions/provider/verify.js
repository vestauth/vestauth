const { logger } = require('./../../../shared/logger')

const { verify } = require('web-bot-auth')
const { verifierFromJWK } = require('web-bot-auth/crypto')

async function _verify (httpMethod, uri, signatureHeader, signatureInputHeader, publicKey) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)
  logger.debug(`signatureHeader: ${signatureHeader}`)
  logger.debug(`signatureInputHeader: ${signatureInputHeader}`)
  logger.debug(`publicKey: ${publicKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const verifier = await verifierFromJWK(JSON.parse(publicKey))
  const headers = {
    Signature: signatureHeader,
    'Signature-Input': signatureInputHeader
  }

  const signedRequest = new Request(uri, { headers: headers })
  const r = await verify(signedRequest, verifier)
  console.log(r)

  const output = {
    implement: 'todo'
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = _verify
