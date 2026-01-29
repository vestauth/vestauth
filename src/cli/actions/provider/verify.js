const crypto = require('crypto')

const { logger } = require('./../../../shared/logger')

const parseSignatureInputHeader = require('./../../../lib/helpers/parseSignatureInputHeader')
const stripDictionaryKey = require('./../../../lib/helpers/stripDictionaryKey')
const authorityMessage = require('./../../../lib/helpers/authorityMessage')
const edPublicKeyObject = require('./../../../lib/helpers/edPublicKeyObject')

const { verify } = require('http-message-sig')
const { verifierFromJWK } = require('web-bot-auth/crypto')

async function _verify (httpMethod, uri, signatureHeader, signatureInputHeader, publicKey) {
  logger.debug(`httpMethod: ${httpMethod}`)
  logger.debug(`uri: ${uri}`)
  logger.debug(`signatureHeader: ${signatureHeader}`)
  logger.debug(`signatureInputHeader: ${signatureInputHeader}`)
  logger.debug(`publicKey: ${publicKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  //
  // verify local
  //
  const { key, values, components } = parseSignatureInputHeader(signatureInputHeader)
  const signatureParams = stripDictionaryKey(signatureInputHeader)
  const signature = stripDictionaryKey(signatureHeader)

  const message = authorityMessage(uri, signatureParams)
  const publicKeyObject = edPublicKeyObject(JSON.parse(publicKey))
  const success = crypto.verify(
    null,
    Buffer.from(message, 'utf8'),
    publicKeyObject,
    Buffer.from(signature, 'base64')
  )

  // //
  // // web-bot-auth verifier
  // //
  // const verifier = await verifierFromJWK(JSON.parse(publicKey))
  // const headers = {
  //   Signature: signatureHeader,
  //   'Signature-Input': signatureInputHeader
  // }
  // const signedRequest = new Request(uri, { headers: headers })
  // let success = false
  // try {
  //   await verify(signedRequest, verifier)
  //   success = true
  // } catch (e) { success = false }

  const output = {
    success
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = _verify
