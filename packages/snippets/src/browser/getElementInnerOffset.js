const getElementScrollOffset = require('./getElementScrollOffset')
const getElementTranslateOffset = require('./getElementTranslateOffset')

function getInnerOffset({element} = {}) {
  const scroll = getElementScrollOffset({element})
  const translate = getElementTranslateOffset({element})
  return {x: scroll.x + translate.x, y: scroll.y + translate.y}
}

module.exports = getInnerOffset
