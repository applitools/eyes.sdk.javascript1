'use strict'
const {RGridResource} = require('@applitools/eyes-sdk-core')

// TODO remove and replace with `new RGridResource`
function toRGridResource({url, type, value, errorStatusCode}) {
  return new RGridResource({url, contentType: type, content: value, errorStatusCode})
}

module.exports = toRGridResource
