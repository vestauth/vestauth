const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

function keypair2 () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const kp = primitives.keypair2()

  const output = {
    public_key: kp.publicKey,
    private_key: kp.privateKey,
    public_key_thumbprint: kp.publicKeyThumbprint
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = keypair2
