const { logger } = require('./../shared/logger')
const tool = require('./../lib/tool')
const primitives = require('./../lib/primitives')
const { connectOrm } = require('./models/index')

const express = require('express')
const crypto = require('crypto')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const hostNoPort = (req.headers.host || '').split(':')[0].toLowerCase()

  // agent-c235... .localhost
  if (hostNoPort.endsWith('.localhost')) {
    let sub = hostNoPort.slice(0, -'.localhost'.length) // "agent-c235..."

    // remove "agent-" prefix if present
    if (sub.startsWith('agent-')) {
      sub = sub.slice('agent-'.length)
    }

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

    const attrs = {
      agent: agent.id,
      kid: verified.kid,
      value: verified.public_jwk
    }
    const publicJwk = await app.models.public_jwk.create(attrs).fetch()
    const agentFormatted = agent.toJSON()

    res.json({
      uid: agentFormatted.uidFormatted,
      kid: publicJwk.kid,
      public_jwk: verified.public_jwk,
      is_new: true
    })
  } catch (err) {
    logger.error(err)
    res.status(401).json({ error: { status: 401, code: 401, message: err.message } })
  }
})

app.get('/.well-known/http-message-signatures-directory', async (req, res) => {
  const agent = await app.models.agent.findOne({ uid: req.agentUid })
  if (!agent) {
    return res.status(404).json({ error: { status: 404, code: 404, message: 'not found' } })
  }

  const jwks = await app.models.public_jwk.find({ agent: agent.id, state: 'active' })
  const keys = jwks.map(j => j.value)

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
