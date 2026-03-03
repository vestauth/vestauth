const { Command } = require('commander')
const env = require('./../../lib/helpers/env')

const tool = new Command('tool')

tool
  .description('🔨 tool')
  .allowUnknownOption()

// vestauth tool init
const initAction = require('./../actions/tool/init')
tool.command('init')
  .description('create tool')
  .option('--hostname <hostname>', 'tool API hostname', env('TOOL_HOSTNAME'))
  .action(initAction)

// vestauth tool verify
const verifyAction = require('./../actions/tool/verify')
tool.command('verify')
  .description('verify agent')
  .argument('<httpMethod>', 'GET (default)')
  .argument('<uri>', '')
  .requiredOption('--signature <signature>', '')
  .requiredOption('--signature-input <signatureInput>', '')
  .requiredOption('--signature-agent <signatureAgent>', '')
  .option('--meter-cost <meterCost>', 'credits per invocation', '0')
  .option('--pp, --pretty-print', 'pretty print output')
  .action(verifyAction)

module.exports = tool
