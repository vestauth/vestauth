function authorityMessage (uri, signatureParams) {
  const u = new URL(uri)
  const authority = u.host // includes port if present

  // other possible message (target-uri, and signature-params)
  // const message = [
  //   `"@method": ${method.toUpperCase()}`,
  //   `"@target-uri": ${uri}`,
  //   `"@signature-params": ${signatureParams}`
  // ].join('\n')

  return [
    `"@authority": ${authority}`,
    `"@signature-params": ${signatureParams}`
  ].join('\n')
}

module.exports = authorityMessage
