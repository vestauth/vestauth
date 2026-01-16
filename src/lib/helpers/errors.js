class Errors {
  constructor (options = {}) {
    this.message = options.message
  }

  dangerousDependencyHoist () {
    const code = 'DANGEROUS_DEPENDENCY_HOIST'
    const message = `[${code}] your environment has hoisted an incompatible version of a dotenvx dependency: ${this.message}`
    const help = `[${code}] https://github.com/vestauth/vestauth`

    const e = new Error(message)
    e.code = code
    e.help = help
    return e
  }
}

module.exports = Errors
