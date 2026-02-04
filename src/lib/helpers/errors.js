class Errors {
  constructor (options = {}) {
    this.message = options.message
  }

  missingId () {
    const code = 'MISSING_ID'
    const message = `[${code}] missing --id (AGENT_ID)`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/6`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
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

  invalidSignatureAgent () {
    const code = 'INVALID_SIGNATURE_AGENT'
    const message = `[${code}] invalid --signature-agent`
    const help = `[${code}] https://github.com/vestauth/vestauth/issues/11`

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
