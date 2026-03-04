const OpenAI = require('openai')
const env = require('./env')

function outputTextFromResponse (response) {
  if (response && typeof response.output_text === 'string' && response.output_text.length > 0) {
    return response.output_text
  }

  if (!response || !Array.isArray(response.output)) return ''

  return response.output
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .filter(content => content.type === 'output_text' && typeof content.text === 'string')
    .map(content => content.text)
    .join('')
}

async function chat (message, options = {}) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    const error = new Error('[MISSING_MESSAGE] missing message')
    error.code = 'MISSING_MESSAGE'
    throw error
  }

  const apiKey = options.apiKey || env('OPENAI_API_KEY')
  if (!apiKey) {
    const error = new Error('[MISSING_OPENAI_API_KEY] missing OPENAI_API_KEY')
    error.code = 'MISSING_OPENAI_API_KEY'
    throw error
  }

  const model = options.model || env('OPENAI_MODEL') || 'gpt-4.1-mini'
  const client = new OpenAI({ apiKey })

  const response = await client.responses.create({
    model,
    input: message
  })

  return outputTextFromResponse(response)
}

module.exports = chat
