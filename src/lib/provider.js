const providerVerify = require('./helpers/providerVerify')
const providerVerifyWebBotAuth = require('./helpers/providerVerifyWebBotAuth')

module.exports = {
  verify: providerVerify,
  verifyWebBotAuth: providerVerifyWebBotAuth
}
