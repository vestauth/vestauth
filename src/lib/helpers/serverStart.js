const { logger } = require('./../../shared/logger')

const express = require('express')

const PORT = process.env.VESTAUTH_PORT || '3000'

function serverStart () {
  const app = express()

  app.get('/', (_req, res) => {
    res.send('hello vestauth')
  })

  app.listen(PORT, () => {
    logger.success(`🖥️  vestauth server listening on http://localhost:${PORT}`)
  })
}

module.exports = serverStart
