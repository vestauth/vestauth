const fs = require('fs')

function touch (filepath) {
  fs.closeSync(fs.openSync(filepath, 'a'))
}

module.exports = touch
