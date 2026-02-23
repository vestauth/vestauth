const serverStart = require('./helpers/serverStart')
const dbCreate = require('./helpers/dbCreate')
const dbDrop = require('./helpers/dbDrop')

module.exports = {
  start: serverStart,
  db: {
    create: dbCreate,
    drop: dbDrop
  }
}
