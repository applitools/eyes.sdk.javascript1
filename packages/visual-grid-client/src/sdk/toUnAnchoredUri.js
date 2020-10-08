'use strict'

function toUnAnchoredUri(url) {
  const m = url && url.match(/(^[^#]*)/)
  const res = (m && m[1]) || url
  return (res && res.replace(/\?\s*$/, '?')) || url
}

module.exports = toUnAnchoredUri
