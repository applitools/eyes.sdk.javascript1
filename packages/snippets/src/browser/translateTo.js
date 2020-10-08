const setElementStyleProperties = require('./setElementStyleProperties')

function translateTo([element, offset] = []) {
  element = element || document.documentElement
  const value = `translate(${-offset.x}px, ${-offset.y}px)`
  setElementStyleProperties([element, {transform: {value}, '-webkit-transform': {value}}])
  return offset
}

module.exports = translateTo
