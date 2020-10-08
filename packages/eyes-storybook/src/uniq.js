'use strict';

function uniq(arr) {
  return Array.from(new Set(arr));
}

module.exports = uniq;
