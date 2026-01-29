function stripDictionaryKey (signatureInputHeader) {
  // sig1=("@authority");created=1769;keyid="abc";alg="ed25519"
  // strip sig1=
  return signatureInputHeader.toString().replace(/^[^=]+=/, '')
}

module.exports = stripDictionaryKey
