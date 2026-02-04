const { logger } = require('./../../../shared/logger')

const primitives = require('./../../../lib/primitives')

function keypair () {
  const options = this.opts()
  logger.debug(`options: ${JSON.stringify(options)}`)

  const kp = primitives.keypair(options.privateJwk, options.prefix)

  const output = {
    public_jwk: kp.publicJwk,
    private_jwk: kp.privateJwk
  }

  let space = 0
  if (options.prettyPrint) {
    space = 2
  }

  console.log(JSON.stringify(output, null, space))
}

module.exports = keypair
