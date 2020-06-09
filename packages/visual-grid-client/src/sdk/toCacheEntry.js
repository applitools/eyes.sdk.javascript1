'use strict'

function toCacheEntry(rGridResource, isContentNeeded = true) {
  return {
    url: rGridResource.getUrl(),
    type: rGridResource.getContentType(),
    hash: rGridResource.getSha256Hash(),
    content: isContentNeeded ? rGridResource.getContent() : undefined,
  }
}

module.exports = toCacheEntry
