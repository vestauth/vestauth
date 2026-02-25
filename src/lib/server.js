const serverInit = require('./helpers/serverInit')
const serverStart = require('./helpers/serverStart')
const dbCreate = require('./helpers/dbCreate')
const dbMigrate = require('./helpers/dbMigrate')
const dbDrop = require('./helpers/dbDrop')
const serverIndex = require('./../server/index')

module.exports = {
  init: serverInit,
  start: serverStart,
  close: serverIndex.close,
  db: {
    create: dbCreate,
    migrate: dbMigrate,
    drop: dbDrop
  }
}
