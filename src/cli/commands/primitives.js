const { Command } = require('commander')

const primitives = new Command('primitives')

primitives
  .description('🔩 primitives')
  .allowUnknownOption()

// vestauth primitives keypair
const keypairAction = require('./../actions/primitives/keypair')
primitives.command('keypair')
  .description('generate public/private keypair')
  .argument('[privateKey]', 'pre-existing private key')
  .option('--prefix <type>', 'agent (default) | provider | none', 'agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(keypairAction)

// vestauth primitives headers
const headersAction = require('./../actions/primitives/headers')
primitives.command('headers')
  .description('generate signed headers')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .argument('<privateKey>', 'private key (json string)')
  .option('--tag <tag>', 'vestauth (default) | web-bot-auth', 'vestauth')
  .option('--nonce <nonce>', 'null (default)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(headersAction)

// vestauth primitives verify
const verifyAction = require('./../actions/primitives/verify')
primitives.command('verify')
  .description('verify signed headers')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .argument('<signature>', '')
  .argument('<signatureInput>', '')
  .argument('<publicKey>', 'public key (json string)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

module.exports = primitives
