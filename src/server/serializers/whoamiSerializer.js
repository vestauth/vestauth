class WhoamiSerializer {
  constructor ({ agent }) {
    this.agent = agent
  }

  run () {
    return this.agent
  }
}

module.exports = WhoamiSerializer
