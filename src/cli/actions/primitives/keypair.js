const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

function keypair (existingPrivateKey) {
  logger.debug(`existingPrivateKey: ${existingPrivateKey}`)

  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const kp = primitives.keypair(existingPrivateKey, options.prefix)

  const output = {
    public_key: kp.publicKey,
    private_key: kp.privateKey
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = keypair
