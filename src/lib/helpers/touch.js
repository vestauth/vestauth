const fs = require('fs')

function touch (filepath) {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, '# vestauth. auth for agents–from the creator of `dotenvx`\n')
  }
}

module.exports = touch
