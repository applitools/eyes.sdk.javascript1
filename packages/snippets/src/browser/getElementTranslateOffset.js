const getElementStyleProperties = require('./getElementStyleProperties')

function getTranslateOffset([
  element = document.scrollingElement || document.documentElement,
] = []) {
  const transforms = getElementStyleProperties([element, ['transform', '-webkit-transform']])
  const translates = Object.keys(transforms).reduce((translates, key) => {
    const transform = transforms[key].value
    if (transform) {
      const match = transform.match(
        /^translate\s*\(\s*(\-?[\d, \.]+)px\s*(,\s*(-?[\d, \.]+)px)?\s*\)/,
      )
      if (!match) {
        throw new Error(`Can't parse CSS transition: ${transform}!`)
      }
      const x = match[1]
      const y = match[3] !== undefined ? match[3] : 0
      translates.push({x: Math.round(-parseFloat(x)), y: Math.round(-parseFloat(y))})
    }
    return translates
  }, [])
  const isSameOffsets = translates.every(
    offset => translates[0].x === offset.x || translates[0].y === offset.y,
  )
  if (!isSameOffsets) {
    throw new Error('Got different css positions!')
  }
  return translates[0] || {x: 0, y: 0}
}

module.exports = getTranslateOffset
