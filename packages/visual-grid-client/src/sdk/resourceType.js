'use strict';

function resourceType(contentType) {
  if (/text\/css/.test(contentType)) {
    return 'CSS';
  } else if (/image\/svg/.test(contentType)) {
    return 'SVG';
  }
}

module.exports = resourceType;
