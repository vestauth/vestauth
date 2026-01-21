class Errors {
  constructor (options = {}) {
    this.message = options.message
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
    const help = `[${code}] https://github.com/vestauth/vestauth`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }
}

module.exports = Errors
