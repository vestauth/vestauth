const { Command } = require('commander')

const tool = new Command('tool')

tool
  .description('🔨 tool')
  .allowUnknownOption()

// vestauth tool verify
const verifyAction = require('./../actions/tool/verify')
tool.command('verify')
  .description('verify agent')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .requiredOption('--signature <signature>', '')
  .requiredOption('--signature-input <signatureInput>', '')
  .requiredOption('--signature-agent <signatureAgent>', '')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

module.exports = tool
