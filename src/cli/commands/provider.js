const { Command } = require('commander')

const provider = new Command('provider')

provider
  .description('🔌 provider')
  .allowUnknownOption()

// vestauth provider challenge
const challengeAction = require('./../actions/provider/challenge')
provider.command('challenge')
  .description('generate challenge')
  .option('-pp, --pretty-print', 'pretty print output')
  .action(challengeAction)

module.exports = provider
