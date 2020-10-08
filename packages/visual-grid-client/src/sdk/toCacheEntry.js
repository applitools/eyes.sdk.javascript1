'use strict'

function toCacheEntry(rGridResource, isContentNeeded = true) {
  if (rGridResource.getErrorStatusCode()) {
    return {
      url: rGridResource.getUrl(),
      errorStatusCode: rGridResource.getErrorStatusCode(),
    }
  } else {
    return {
      url: rGridResource.getUrl(),
      type: rGridResource.getContentType(),
      hash: rGridResource.getSha256Hash(),
      content: isContentNeeded ? rGridResource.getContent() : undefined,
    }
  }
}

module.exports = toCacheEntry
