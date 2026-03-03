const t = require('tap')
t.jobs = 1

const initActionPath = require.resolve('../../../../src/cli/actions/tool/init')
const loggerPath = require.resolve('../../../../src/shared/logger')
const catchAndLogPath = require.resolve('../../../../src/lib/helpers/catchAndLog')
const toolPath = require.resolve('../../../../src/lib/tool')
let originalLoggerModule
let originalCatchAndLogModule
let originalToolModule
let toolInitCalls

t.beforeEach(() => {
  toolInitCalls = []
  originalLoggerModule = require.cache[loggerPath]
  originalCatchAndLogModule = require.cache[catchAndLogPath]
  originalToolModule = require.cache[toolPath]
  delete require.cache[initActionPath]
})

t.afterEach(() => {
  if (originalLoggerModule) require.cache[loggerPath] = originalLoggerModule
  else delete require.cache[loggerPath]

  if (originalCatchAndLogModule) require.cache[catchAndLogPath] = originalCatchAndLogModule
  else delete require.cache[catchAndLogPath]

  if (originalToolModule) require.cache[toolPath] = originalToolModule
  else delete require.cache[toolPath]

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

  require.cache[toolPath] = {
    exports: {
      init: async (hostname) => {
        toolInitCalls.push(hostname)
        return { isNew: true, path: '.env', TOOL_UID: 'tool-test', TOOL_HOSTNAME: 'https://api.vestauth.com' }
      }
    }
  }

  delete require.cache[initActionPath]
}

t.test('init action passes hostname when explicitly provided by cli flag', async t => {
  mockInitActionDeps()

  const initAction = require('../../../../src/cli/actions/tool/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-flag.com' })
  })

  t.same(toolInitCalls, ['api.from-flag.com'])
})

t.test('init action passes hostname when value comes from default option', async t => {
  mockInitActionDeps()

  const initAction = require('../../../../src/cli/actions/tool/init')
  await initAction.call({
    opts: () => ({ hostname: 'api.from-env.com' })
  })

  t.same(toolInitCalls, ['api.from-env.com'])
})
