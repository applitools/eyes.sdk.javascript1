'use strict';

function flat(arr) {
  return [].concat(...arr);
}

module.exports = flat;
