const t = require('tap')
t.jobs = 1

const curlActionPath = require.resolve('../../../../src/cli/actions/agent/curl')
const loggerPath = require.resolve('../../../../src/shared/logger')
const catchAndLogPath = require.resolve('../../../../src/lib/helpers/catchAndLog')
const agentPath = require.resolve('../../../../src/lib/agent')
const executePath = require.resolve('../../../../src/lib/helpers/execute')

let originalLoggerModule
let originalCatchAndLogModule
let originalAgentModule
let originalExecuteModule
let originalConsoleLog
let headerCalls
let execaCalls

t.beforeEach(() => {
  headerCalls = []
  execaCalls = []
  originalLoggerModule = require.cache[loggerPath]
  originalCatchAndLogModule = require.cache[catchAndLogPath]
  originalAgentModule = require.cache[agentPath]
  originalExecuteModule = require.cache[executePath]
  originalConsoleLog = console.log
  console.log = () => {}
  delete require.cache[curlActionPath]
})

t.afterEach(() => {
  if (originalLoggerModule) require.cache[loggerPath] = originalLoggerModule
  else delete require.cache[loggerPath]

  if (originalCatchAndLogModule) require.cache[catchAndLogPath] = originalCatchAndLogModule
  else delete require.cache[catchAndLogPath]

  if (originalAgentModule) require.cache[agentPath] = originalAgentModule
  else delete require.cache[agentPath]

  if (originalExecuteModule) require.cache[executePath] = originalExecuteModule
  else delete require.cache[executePath]

  console.log = originalConsoleLog
  delete require.cache[curlActionPath]
})

function mockCurlActionDeps () {
  require.cache[loggerPath] = {
    exports: {
      logger: {
        debug: () => {}
      }
    }
  }

  require.cache[catchAndLogPath] = {
    exports: () => {}
  }

  require.cache[agentPath] = {
    exports: {
      headers: async (method, url) => {
        headerCalls.push({ method, url })
        return {
          Signature: 'sig',
          'Signature-Input': 'sig-input',
          'Signature-Agent': 'sig-agent'
        }
      }
    }
  }

  require.cache[executePath] = {
    exports: {
      execa: async (cmd, args) => {
        execaCalls.push({ cmd, args })
        return { stdout: '{}', exitCode: 0 }
      }
    }
  }

  delete require.cache[curlActionPath]
}

t.test('curl action defaults to POST and application/json when missing', async t => {
  mockCurlActionDeps()

  const action = require('../../../../src/cli/actions/agent/curl')
  await action.call({
    args: ['https://api.vestauth.com/whoami'],
    opts: () => ({ prettyPrint: false })
  })

  t.same(headerCalls, [{ method: 'POST', url: 'https://api.vestauth.com/whoami' }])
  t.equal(execaCalls.length, 1)
  t.same(execaCalls[0].args, [
    '-H', 'Signature: sig',
    '-H', 'Signature-Input: sig-input',
    '-H', 'Signature-Agent: sig-agent',
    '-X', 'POST',
    '-H', 'Content-Type: application/json',
    'https://api.vestauth.com/whoami'
  ])
})

t.test('curl action preserves explicit method and content-type header', async t => {
  mockCurlActionDeps()

  const action = require('../../../../src/cli/actions/agent/curl')
  await action.call({
    args: [
      '--request=GET',
      '-H', 'Content-Type: text/plain',
      'https://api.vestauth.com/whoami'
    ],
    opts: () => ({ prettyPrint: false })
  })

  t.same(headerCalls, [{ method: 'GET', url: 'https://api.vestauth.com/whoami' }])
  t.equal(execaCalls.length, 1)
  t.same(execaCalls[0].args, [
    '-H', 'Signature: sig',
    '-H', 'Signature-Input: sig-input',
    '-H', 'Signature-Agent: sig-agent',
    '--request=GET',
    '-H', 'Content-Type: text/plain',
    'https://api.vestauth.com/whoami'
  ])
})
