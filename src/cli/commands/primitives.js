const { Command } = require('commander')

const primitives = new Command('primitives')

const env = require('./../../lib/helpers/env')

primitives
  .description('🔩 primitives')
  .allowUnknownOption()

// vestauth primitives keypair
const keypairAction = require('./../actions/primitives/keypair')
primitives.command('keypair')
  .description('generate public/private keypair')
  .option('--private-key <privateKey>', 'pre-existing private key')
  .option('--prefix <type>', 'agent (default) | provider | none', 'agent')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(keypairAction)

// vestauth primitives headers
const headersAction = require('./../actions/primitives/headers')
primitives.command('headers')
  .description('generate signed headers')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .option('--id <id>', 'id (string)', env('AGENT_ID'))
  .option('--private-key <privateKey>', 'private key (json string)', env('AGENT_PRIVATE_KEY'))
  .option('--tag <tag>', 'web-bot-auth (default) | web-bot-auth', 'web-bot-auth')
  .option('--nonce <nonce>', 'null (default)')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(headersAction)

// vestauth primitives verify
const verifyAction = require('./../actions/primitives/verify')
primitives.command('verify')
  .description('verify signed headers')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .requiredOption('--signature <signature>', '')
  .requiredOption('--signature-input <signatureInput>', '')
  .option('--signature-agent <signatureAgent>', '')
  .option('--public-key <publicKey>', 'public key (json string)', env('AGENT_PUBLIC_KEY'))
  .option('--pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

module.exports = primitives
