'use strict';
const resourceType = require('./resourceType');

function toCacheEntry(rGridResource) {
  const contentType = rGridResource.getContentType();
  return {
    url: rGridResource.getUrl(),
    type: contentType,
    hash: rGridResource.getSha256Hash(),
    content: resourceType(contentType) ? rGridResource.getContent() : undefined,
  };
}

module.exports = toCacheEntry;
