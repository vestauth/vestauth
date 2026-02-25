const fs = require('fs')

const DEFAULT_HEADER_COMMENT = '# [vestauth] web-bot-auth for agents–from the creator of `dotenv` and `dotenvx`'

function touch (filepath, headerComment = null) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, `${headerComment || DEFAULT_HEADER_COMMENT}\n`)
  }
}

module.exports = touch
