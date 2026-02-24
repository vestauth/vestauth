const { logger } = require('./../shared/logger')
const tool = require('./../lib/tool')
const { connectOrm } = require('./models/index')
const RegisterService = require('./services/registerService')
const RegisterSerializer = require('./serializers/registerSerializer')

const express = require('express')

const app = express()
let ORM = null
let HTTP_SERVER = null
let CLOSE_PROMISE = null
let SIGNAL_HANDLERS_INSTALLED = false
let SIGNAL_HANDLERS = null
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
    const result = await new RegisterService({
      models: app.models,
      httpMethod: req.method,
      uri: url,
      headers: req.headers,
      publicJwk: req.body.public_jwk
    }).run()
    const json = new RegisterSerializer(result).run()

    res.json(json)
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

  if (HTTP_SERVER) return HTTP_SERVER

  try {
    const { orm, config } = connectOrm({ databaseUrl })

    // promisify initialize
    const db = await new Promise((resolve, reject) => {
      orm.initialize(config, (err, ontology) => {
        if (err) return reject(err)
        resolve(ontology)
      })
    })

    ORM = orm
    app.models = db.collections

    HTTP_SERVER = await new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        logger.success(`vestauth server listening on http://localhost:${PORT}`)
        resolve(server)
      })

      server.once('error', reject)
    })

    installSignalHandlers()

    return HTTP_SERVER
  } catch (error) {
    await close().catch(() => {})
    throw error
  }
}

async function close () {
  if (CLOSE_PROMISE) return CLOSE_PROMISE

  CLOSE_PROMISE = (async () => {
    removeSignalHandlers()

    if (HTTP_SERVER) {
      await new Promise((resolve, reject) => {
        HTTP_SERVER.close((err) => {
          if (err) return reject(err)
          resolve()
        })
      })
      HTTP_SERVER = null
    }

    if (ORM) {
      await new Promise((resolve, reject) => {
        ORM.teardown((err) => {
          if (err) return reject(err)
          resolve()
        })
      })
      ORM = null
    }

    delete app.models
  })()

  try {
    await CLOSE_PROMISE
  } finally {
    CLOSE_PROMISE = null
  }
}

function installSignalHandlers () {
  if (SIGNAL_HANDLERS_INSTALLED) return

  const shutdown = () => {
    close()
      .then(() => process.exit(0))
      .catch((err) => {
        logger.error(err)
        process.exit(1)
      })
  }

  SIGNAL_HANDLERS = {
    SIGINT: () => shutdown('SIGINT'),
    SIGTERM: () => shutdown('SIGTERM')
  }

  process.once('SIGINT', SIGNAL_HANDLERS.SIGINT)
  process.once('SIGTERM', SIGNAL_HANDLERS.SIGTERM)
  SIGNAL_HANDLERS_INSTALLED = true
}

function removeSignalHandlers () {
  if (!SIGNAL_HANDLERS_INSTALLED || !SIGNAL_HANDLERS) return

  process.removeListener('SIGINT', SIGNAL_HANDLERS.SIGINT)
  process.removeListener('SIGTERM', SIGNAL_HANDLERS.SIGTERM)
  SIGNAL_HANDLERS = null
  SIGNAL_HANDLERS_INSTALLED = false
}

module.exports = {
  app,
  start,
  close
}
