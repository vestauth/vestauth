const t = require('tap')
t.jobs = 1

const initActionPath = require.resolve('../../../../src/cli/actions/agent/init')
const loggerPath = require.resolve('../../../../src/shared/logger')
const catchAndLogPath = require.resolve('../../../../src/lib/helpers/catchAndLog')
const agentPath = require.resolve('../../../../src/lib/agent')
let originalLoggerModule
let originalCatchAndLogModule
let originalAgentModule
let agentInitCalls

t.beforeEach(() => {
  agentInitCalls = []
  originalLoggerModule = require.cache[loggerPath]
  originalCatchAndLogModule = require.cache[catchAndLogPath]
  originalAgentModule = require.cache[agentPath]
  delete require.cache[initActionPath]
})

t.afterEach(() => {
  if (originalLoggerModule) require.cache[loggerPath] = originalLoggerModule
  else delete require.cache[loggerPath]

  if (originalCatchAndLogModule) require.cache[catchAndLogPath] = originalCatchAndLogModule
  else delete require.cache[catchAndLogPath]

  if (originalAgentModule) require.cache[agentPath] = originalAgentModule
  else delete require.cache[agentPath]

  delete require.cache[initActionPath]
})

function mockInitActionDeps () {
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
}

t.test('init action passes hostname when explicitly provided by cli flag', async t => {
  mockInitActionDeps()

  const initAction = require('../../../../src/cli/actions/agent/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-flag.com' }),
    getOptionValueSource: () => 'cli'
  })

  t.same(agentInitCalls, ['api.from-flag.com'])
})

t.test('init action passes hostname when value comes from default option', async t => {
  mockInitActionDeps()

  const initAction = require('../../../../src/cli/actions/agent/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-env.com' }),
    getOptionValueSource: () => 'default'
  })

  t.same(agentInitCalls, ['api.from-env.com'])
})
