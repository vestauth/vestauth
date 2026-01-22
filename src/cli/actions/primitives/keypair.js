const { logger } = require('./../../../shared/logger')

const main = require('./../../../lib/main')

function keypair (existingPrivateKey) {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const kp = main.keypair(existingPrivateKey, options.prefix)

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
