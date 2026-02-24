const { logger } = require('./../../shared/logger')
const tool = require('./../tool')
const primitives = require('./../primitives')
const { connectOrm } = require('./models/index')

const express = require('express')
const crypto = require('crypto')

const PUBLIC_JWKS = []
let ORM = null

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const hostNoPort = (req.headers.host || '').split(':')[0].toLowerCase()

  // agent-c235... .localhost
  if (hostNoPort.endsWith('.localhost')) {
    const sub = hostNoPort.slice(0, -'.localhost'.length) // "agent-c235..."
    req.agentUid = sub
    return next()
  }

  next()
})

app.get('/', (req, res) => {
  if (req.agentUid) {
    res.json({ uid: req.agentUid })
  } else {
    res.json({ hello: 'vestauth' })
  }
})

app.post('/register', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const verified = await primitives.verify(req.method, url, req.headers, req.body.public_jwk)

    const agent = await app.models.agent.create().fetch()

    const publicJwk = {
      agent_uid: agent.uid,
      kid: verified.kid,
      value: verified.public_jwk
    }
    PUBLIC_JWKS.push(publicJwk)

    res.json({
      uid: agent.uidFormatted,
      kid: publicJwk.kid,
      public_jwk: verified.public_jwk,
      is_new: true
    })
  } catch (err) {
    logger.error(err)
    res.status(401).json({ error: { status: 401, code: 401, message: err.message } })
  }
})

app.get('/.well-known/http-message-signatures-directory', (req, res) => {
  const keys = PUBLIC_JWKS
    .filter(jwk => jwk.agent_uid === req.agentUid)
    .map(jwk => jwk.value)

  return res.json({ keys })
})

app.get('/whoami', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const verified = await tool.verify(req.method, url, req.headers)

    res.json(verified)
  } catch (err) {
    logger.error(err)
    res.status(401).json({ error: { status: 401, code: 401, message: err.message } })
  }
})

async function start ({ port, databaseUrl } = {}) {
  const PORT = port || '3000'

  const { orm, config } = connectOrm({ databaseUrl })

  // promisify initialize
  const db = await new Promise((resolve, reject) => {
    orm.initialize(config, (err, ontology) => {
      if (err) return reject(err)
      resolve(ontology)
    })
  })

  app.models = db.collections

  return app.listen(PORT, () => {
    logger.success(`vestauth server listening on http://localhost:${PORT}`)
  })
}

module.exports = {
  app,
  start
}
