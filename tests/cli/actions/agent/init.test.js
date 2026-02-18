const t = require('tap')

const initActionPath = require.resolve('../../../../src/cli/actions/agent/init')
const loggerPath = require.resolve('../../../../src/shared/logger')
const catchAndLogPath = require.resolve('../../../../src/lib/helpers/catchAndLog')
const agentPath = require.resolve('../../../../src/lib/agent')

function mockInitActionDeps () {
  const agentInitCalls = []
  const originals = {
    logger: require.cache[loggerPath],
    catchAndLog: require.cache[catchAndLogPath],
    agent: require.cache[agentPath]
  }

  require.cache[loggerPath] = {
    exports: {
      logger: {
        debug: () => {},
        success: () => {},
        info: () => {},
        help: () => {}
      }
    }
  }

  require.cache[catchAndLogPath] = {
    exports: () => {}
  }

  require.cache[agentPath] = {
    exports: {
      init: async (hostname) => {
        agentInitCalls.push(hostname)
        return { isNew: true, path: '.env', AGENT_UID: 'agent-test' }
      }
    }
  }

  delete require.cache[initActionPath]

  return {
    agentInitCalls,
    restore: () => {
      if (originals.logger) require.cache[loggerPath] = originals.logger
      else delete require.cache[loggerPath]

      if (originals.catchAndLog) require.cache[catchAndLogPath] = originals.catchAndLog
      else delete require.cache[catchAndLogPath]

      if (originals.agent) require.cache[agentPath] = originals.agent
      else delete require.cache[agentPath]

      delete require.cache[initActionPath]
    }
  }
}

t.test('init action passes hostname when explicitly provided by cli flag', async t => {
  const { agentInitCalls, restore } = mockInitActionDeps()
  t.teardown(restore)

  const initAction = require('../../../../src/cli/actions/agent/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-flag.com' }),
    getOptionValueSource: () => 'cli'
  })

  t.same(agentInitCalls, ['api.from-flag.com'])
})

t.test('init action passes null when hostname comes from default value', async t => {
  const { agentInitCalls, restore } = mockInitActionDeps()
  t.teardown(restore)

  const initAction = require('../../../../src/cli/actions/agent/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-env.com' }),
    getOptionValueSource: () => 'default'
  })

  t.same(agentInitCalls, [null])
})
