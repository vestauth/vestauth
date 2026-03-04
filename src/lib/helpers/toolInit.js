const dotenvx = require('@dotenvx/dotenvx')
const toolIdentity = require('./toolIdentity')
const keypair = require('./keypair')
const touch = require('./touch')
const normalizeToolHostname = require('./normalizeToolHostname')
const PostToolRegister = require('../api/postToolRegister')

async function toolInit (hostname = null) {
  const envPath = '.env'
  const normalizedHostname = normalizeToolHostname(hostname)
  const shouldPersistHostname = normalizedHostname !== 'https://api.vestauth.com'

  // keypair
  const currentPrivateJwk = toolIdentity(false).privateJwk
  const kp = keypair(currentPrivateJwk, 'tool')

  touch(envPath)

  // register tool
  const tool = await new PostToolRegister(normalizedHostname, kp.publicJwk, kp.privateJwk).run()
  dotenvx.set('TOOL_UID', tool.uid, { path: envPath, plain: true, quiet: true })
  dotenvx.set('TOOL_PUBLIC_JWK', JSON.stringify(kp.publicJwk), { path: envPath, plain: true, quiet: true })
  dotenvx.set('TOOL_PRIVATE_JWK', JSON.stringify(kp.privateJwk), { path: envPath, plain: true, quiet: true })
  if (shouldPersistHostname) {
    dotenvx.set('TOOL_HOSTNAME', normalizedHostname, { path: envPath, plain: true, quiet: true })
  }

  return {
    TOOL_UID: tool.uid,
    TOOL_PUBLIC_JWK: kp.publicJwk,
    TOOL_HOSTNAME: normalizedHostname,
    path: envPath,
    isNew: tool.is_new
  }
}

module.exports = toolInit
