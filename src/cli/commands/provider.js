const { Command } = require('commander')

const provider = new Command('provider')

provider
  .description('🔌 provider')
  .allowUnknownOption()

// vestauth provider verify
const verifyAction = require('./../actions/provider/verify')
provider.command('verify')
  .description('verify agent')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .argument('<signatureHeader>', '')
  .argument('<signatureInputHeader>', '')
  .argument('<publicKey>', 'public key (json string)')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

// vestauth provider challenge
const challengeAction = require('./../actions/provider/challenge')
provider.command('challenge')
  .description('generate challenge')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(challengeAction)

module.exports = provider
