const { logger } = require('./../shared/logger')
const { version } = require('./../lib/helpers/packageJson')
const resolvePortAndHostname = require('./../lib/helpers/resolvePortAndHostname')
const subdomainBaseHost = require('./../lib/helpers/subdomainBaseHost')
const { connectOrm } = require('./models/index')
const RegisterService = require('./services/registerService')
const RegisterSerializer = require('./serializers/registerSerializer')
const RotateService = require('./services/rotateService')
const RotateSerializer = require('./serializers/rotateSerializer')
const WhoamiService = require('./services/whoamiService')
const WhoamiSerializer = require('./serializers/whoamiSerializer')

const express = require('express')

let DB = null
let HTTP_SERVER = null
let CLOSE_PROMISE = null
let SIGNAL_HANDLERS_INSTALLED = false
let SIGNAL_HANDLERS = null
let PORT = null
let HOSTNAME = null

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const hostNoPort = (req.headers.host || '').split(':')[0].toLowerCase()
  const baseHost = subdomainBaseHost(HOSTNAME)

  // agent-c235... .localhost or agent-c235... .example.com
  if (baseHost && hostNoPort.endsWith(`.${baseHost}`)) {
    let sub = hostNoPort.slice(0, -`.${baseHost}`.length) // "agent-c235..."

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
    res.json({
      service: 'vestauth',
      status: 'ok',
      version
    })
  }
})

app.post('/register', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    const attrs = {
      models: app.models,
      httpMethod: req.method,
      uri: url,
      headers: req.headers,
      publicJwk: req.body.public_jwk
    }
    const { agent, publicJwk, isNew } = await new RegisterService(attrs).run()

    const json = new RegisterSerializer({ agent, publicJwk, isNew }).run()
    res.json(json)
  } catch (err) {
    logger.error(err)
    res.status(401).json({ error: { status: 401, code: 401, message: err.message } })
  }
})

app.post('/rotate', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    const attrs = {
      models: app.models,
      httpMethod: req.method,
      uri: url,
      headers: req.headers,
      publicJwk: req.body.public_jwk
    }
    const { agent, publicJwk } = await new RotateService(attrs).run()

    const json = new RotateSerializer({ agent, publicJwk }).run()
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
    const attrs = {
      httpMethod: req.method,
      uri: url,
      headers: req.headers
    }
    const agent = await new WhoamiService(attrs).run()

    const json = new WhoamiSerializer({ agent }).run()
    res.json(json)
  } catch (err) {
    logger.error(err)
    res.status(401).json({ error: { status: 401, code: 401, message: err.message } })
  }
})

async function start ({ port, hostname, databaseUrl } = {}) {
  ({ PORT, HOSTNAME } = resolvePortAndHostname({ port, hostname }))

  if (HTTP_SERVER) return HTTP_SERVER

  try {
    const { db, models } = connectOrm({ databaseUrl })
    DB = db
    app.models = models

    HTTP_SERVER = await new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        logger.success(`vestauth server listening on ${HOSTNAME}`)
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

    if (DB) {
      await DB.destroy()
      DB = null
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
  close,
  resolvePortAndHostname
}
