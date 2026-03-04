const t = require('tap')
t.jobs = 1

const chatPath = require.resolve('../../../src/lib/helpers/chat')
const openaiPath = require.resolve('openai')
const envPath = require.resolve('../../../src/lib/helpers/env')

let originalOpenAiModule
let originalEnvModule
let openAiCalls
let createCalls

function mockModules ({ apiKey = 'test-key', model = null, response = { output_text: 'hello world' } } = {}) {
  openAiCalls = []
  createCalls = []

  require.cache[openaiPath] = {
    exports: class OpenAI {
      constructor (options) {
        openAiCalls.push(options)
      }

      get responses () {
        return {
          create: async (payload) => {
            createCalls.push(payload)
            return response
          }
        }
      }
    }
  }

  require.cache[envPath] = {
    exports: (key) => {
      if (key === 'OPENAI_API_KEY') return apiKey
      if (key === 'OPENAI_MODEL') return model
      return null
    }
  }

  delete require.cache[chatPath]
}

t.beforeEach(() => {
  originalOpenAiModule = require.cache[openaiPath]
  originalEnvModule = require.cache[envPath]
  delete require.cache[chatPath]
})

t.afterEach(() => {
  if (originalOpenAiModule) require.cache[openaiPath] = originalOpenAiModule
  else delete require.cache[openaiPath]

  if (originalEnvModule) require.cache[envPath] = originalEnvModule
  else delete require.cache[envPath]

  delete require.cache[chatPath]
})

t.test('chat sends message and returns output text', async t => {
  mockModules()

  const chat = require('../../../src/lib/helpers/chat')
  const result = await chat('Say hello')

  t.equal(result, 'hello world')
  t.same(openAiCalls[0], { apiKey: 'test-key' })
  t.same(createCalls[0], {
    model: 'gpt-4.1-mini',
    input: 'Say hello'
  })
})

t.test('chat uses passed model over environment model', async t => {
  mockModules({ model: 'gpt-4.1-nano' })

  const chat = require('../../../src/lib/helpers/chat')
  await chat('test', { model: 'gpt-4.1-mini' })

  t.equal(createCalls[0].model, 'gpt-4.1-mini')
})

t.test('chat uses OPENAI_MODEL when set', async t => {
  mockModules({ model: 'gpt-4.1-nano' })

  const chat = require('../../../src/lib/helpers/chat')
  await chat('test')

  t.equal(createCalls[0].model, 'gpt-4.1-nano')
})

t.test('chat returns concatenated output text when output_text is missing', async t => {
  mockModules({
    response: {
      output: [
        {
          content: [
            { type: 'output_text', text: 'hello' },
            { type: 'ignored', text: 'x' }
          ]
        },
        {
          content: [
            { type: 'output_text', text: ' world' }
          ]
        }
      ]
    }
  })

  const chat = require('../../../src/lib/helpers/chat')
  const result = await chat('Say hello')

  t.equal(result, 'hello world')
})

t.test('chat throws on missing message', async t => {
  mockModules()

  const chat = require('../../../src/lib/helpers/chat')

  await t.rejects(() => chat(''), {
    code: 'MISSING_MESSAGE'
  })
})

t.test('chat throws on missing OPENAI_API_KEY', async t => {
  mockModules({ apiKey: null })

  const chat = require('../../../src/lib/helpers/chat')

  await t.rejects(() => chat('hello'), {
    code: 'MISSING_OPENAI_API_KEY'
  })
})
