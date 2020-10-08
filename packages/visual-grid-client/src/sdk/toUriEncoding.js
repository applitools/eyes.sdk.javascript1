'use strict'

function toUriEncoding(url) {
  const result =
    (url &&
      url.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, s => {
        const int = parseInt(s.substr(1).trim(), 16)
        return String.fromCodePoint(int)
      })) ||
    url
  return result
}

module.exports = toUriEncoding
