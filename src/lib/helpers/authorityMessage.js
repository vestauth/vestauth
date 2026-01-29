function authorityMessage (uri, signatureParams) {
  const u = new URL(uri)
  const authority = u.host // includes port if present

  return [
    `"@authority": ${authority}`,
    `"@signature-params": ${signatureParams}`
  ].join('\n')
}

module.exports = authorityMessage
