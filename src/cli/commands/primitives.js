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
  .argument('[private_key]', 'pre-existing private key')
  .option('--prefix <type>', 'agent (default) | provider | none', 'agent')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(keypairAction)

// vestauth primitives keypair2
const keypair2Action = require('./../actions/primitives/keypair2')
primitives.command('keypair2')
  .description('generate public/private keypair')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(keypair2Action)

// vestauth primitives signature2
const signature2Action = require('./../actions/primitives/signature2')
primitives.command('signature2')
  .description('generate signature')
  .argument('<privateKey>', 'private key (json string)')
  .option('--tag <tag>', 'vestauth (default) | web-bot-auth', 'vestauth')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(signature2Action)

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
