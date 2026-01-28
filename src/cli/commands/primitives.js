const { Command } = require('commander')

const primitives = new Command('primitives')

primitives
  .description('🔩 primitives')
  .allowUnknownOption()

// vestauth primitives challenge
const challengeAction = require('./../actions/primitives/challenge')
primitives.command('challenge')
  .description('generate challenge')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(challengeAction)

// vestauth primitives hash [message]
const hashAction = require('./../actions/primitives/hash')
primitives.command('hash')
  .description('hash message')
  .argument('<message>', 'message string')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(hashAction)

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
  .option('-pp, --pretty-print', 'pretty print output')
  .action(headersAction)

// vestauth primitives sign
const signAction = require('./../actions/primitives/sign')
primitives.command('sign')
  .description('sign challenge')
  .argument('<challenge>', 'challenge (base64url)')
  .argument('<privateKey>', 'private key (hex)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(signAction)

// vestauth primitives verify
const verifyAction = require('./../actions/primitives/verify')
primitives.command('verify')
  .description('verify signature')
  .argument('<challenge>', 'challenge (base64url)')
  .argument('<signature>', 'signature (base64url)')
  .argument('<publicKey>', 'public key (hex)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

module.exports = primitives
