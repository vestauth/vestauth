const { parseDictionary } = require('structured-headers')

// example: sig1=(\"@authority\");created=1769707366;keyid=\"xWuYtVgVV_ZQcfEWexUoln9ynA56PmfF4tAvWQ_Bf_o\";alg=\"ed25519\";expires=1769707666;nonce=\"RtdaKawQVJxEAJwCfI_5-7oVTmfjFkz-rGGifYZ2o2MdAMwJF2nYG3713rL1f9FJmPp8T2j4Sqcmh8H8p8TkRA\";tag=\"web-bot-auth\"
function parseSignatureInputHeader (signatureInputHeader) {
  if (signatureInputHeader === undefined) {
    return undefined
  }

  const dictionary = parseDictionary(signatureInputHeader)
  const entry = dictionary.entries().next()
  const [, innerlist] = entry.value
  const [, params] = innerlist
  const values = Object.fromEntries(params)

  return values
}

module.exports = parseSignatureInputHeader
