const tool = require('./../../lib/tool')

class WhoamiService {
  constructor ({ httpMethod, uri, headers, serverHostname }) {
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
    this.serverHostname = serverHostname
  }

  async run () {
    return tool.verify(this.httpMethod, this.uri, this.headers, this.serverHostname)
  }
}

module.exports = WhoamiService
