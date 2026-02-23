const express = require('express')
const { logger } = require('./../../shared/logger')

const PORT = process.env.VESTAUTH_PORT || '3000'

const app = express()

app.get('/', (_req, res) => {
  res.send('hello vestauth')
})

function start ({ port } = {}) {
  const usePort = port || PORT

  return app.listen(usePort, () => {
    logger.success(`🖥️  vestauth server listening on http://localhost:${usePort}`)
  })
}

module.exports = {
  app,
  start
}
