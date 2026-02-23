const serverStart = require('./helpers/serverStart')
const dbCreate = require('./helpers/dbCreate')
const dbMigrate = require('./helpers/dbMigrate')
const dbDrop = require('./helpers/dbDrop')

module.exports = {
  start: serverStart,
  db: {
    create: dbCreate,
    migrate: dbMigrate,
    drop: dbDrop
  }
}
