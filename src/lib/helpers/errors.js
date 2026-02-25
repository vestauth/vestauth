class Errors {
  constructor (options = {}) {
    this.message = options.message
    this.exitCode = options.exitCode
  }

  missingUid () {
    const code = 'MISSING_ID'
    const message = `[${code}] missing --uid (AGENT_UID)`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/6`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  missingId () {
    return this.missingUid()
  }

  missingPrivateJwk () {
    const code = 'MISSING_PRIVATE_JWK'
    const message = `[${code}] missing --private-jwk (AGENT_PRIVATE_JWK)`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/5`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  invalidPrivateJwk () {
    const code = 'INVALID_PRIVATE_JWK'
    const message = `[${code}] invalid --private-jwk (AGENT_PRIVATE_JWK)`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/7`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  expiredSignature () {
    const code = 'EXPIRED_SIGNATURE'
    const message = `[${code}] expired signature`

    const e = new Error(message)
    e.code = code
    return e
  }

  invalidSignature () {
    const code = 'INVALID_SIGNATURE'
    const message = `[${code}] invalid signature`

    const e = new Error(message)
    e.code = code
    return e
  }

  missingSignatureInput () {
    const code = 'MISSING_SIGNATURE_INPUT'
    const message = `[${code}] missing --signature-input`

    const e = new Error(message)
    e.code = code
    return e
  }

  missingSignatureAgent () {
    const code = 'MISSING_SIGNATURE_AGENT'
    const message = `[${code}] missing --signature-agent`

    const e = new Error(message)
    e.code = code
    return e
  }

  missingPublicJwk () {
    const code = 'MISSING_PUBLIC_JWK'
    const message = `[${code}] missing --public-jwk (AGENT_PUBLIC_JWK) or --signature-agent`
    const help = `[${code}] provide a public JWK or a signature agent for lookup`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  invalidSignatureAgent () {
    const code = 'INVALID_SIGNATURE_AGENT'
    const message = `[${code}] invalid --signature-agent`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/11`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  untrustedSignatureAgent () {
    const code = 'UNTRUSTED_SIGNATURE_AGENT'
    const message = `[${code}] untrusted --signature-agent`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/42`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  missingHttpMethod () {
    const code = 'MISSING_HTTP_METHOD'
    const message = `[${code}] missing httpMethod`
    const help = `[${code}] pass httpMethod as the first argument (ex: GET)`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  missingUri () {
    const code = 'MISSING_URI'
    const message = `[${code}] missing uri`
    const help = `[${code}] pass uri as the second argument (ex: https://example.com/path)`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  missingDatabaseUrl () {
    const code = 'MISSING_DATABASE_URL'
    const message = `[${code}] missing DATABASE_URL`
    const help = `[${code}] pass --database-url or set DATABASE_URL`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  commandFailed () {
    const code = 'COMMAND_FAILED'
    const message = `[${code}] command failed with exit code ${this.exitCode}`

    const e = new Error(message)
    e.code = code
    return e
  }

  econnrefused () {
    const code = 'ECONNREFUSED'
    const message = `[${code}] connection refused`
    const help = `[${code}] check your internet connection`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }

  dangerousDependencyHoist () {
    const code = 'DANGEROUS_DEPENDENCY_HOIST'
    const message = `[${code}] your environment has hoisted an incompatible version of a vestauth dependency: ${this.message}`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/4`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }
}

module.exports = Errors
