const tool = require('./../../lib/tool')

class WhoamiService {
  constructor ({ httpMethod, uri, headers }) {
    this.httpMethod = httpMethod
    this.uri = uri
    this.headers = headers
  }

  async run () {
    return tool.verify(this.httpMethod, this.uri, this.headers)
  }
}

module.exports = WhoamiService
