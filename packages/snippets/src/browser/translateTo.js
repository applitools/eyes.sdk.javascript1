const setElementStyleProperties = require('./setElementStyleProperties')

function translateTo({offset, element = document.documentElement} = {}) {
  const value = `translate(${-offset.x}px, ${-offset.y}px)`
  setElementStyleProperties({
    element,
    properties: {transform: value, webkitTransform: value},
  })
  return offset
}

module.exports = translateTo
