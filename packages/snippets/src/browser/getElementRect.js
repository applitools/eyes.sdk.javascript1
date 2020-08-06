const findFixedAncestor = require('./getElementFixedAncestor')
const isElementScrollable = require('./isElementScrollable')
const getElementInnerOffset = require('./getElementInnerOffset')

module.exports = function getElementRect({element, isClient = false} = {}) {
  const elementBoundingClientRect = element.getBoundingClientRect()
  const rect = {
    x: elementBoundingClientRect.left,
    y: elementBoundingClientRect.top,
    width: elementBoundingClientRect.width,
    height: elementBoundingClientRect.height,
  }
  if (isClient) {
    const elementComputedStyle = window.getComputedStyle(element)
    rect.x += parseInt(elementComputedStyle.getPropertyValue('border-left-width'))
    rect.y += parseInt(elementComputedStyle.getPropertyValue('border-top-width'))
    rect.width = element.clientWidth
    rect.height = element.clientHeight
  }
  const fixedAncestor = findFixedAncestor({element})
  if (fixedAncestor) {
    const isFixedAncestorScrollable = isElementScrollable({element: fixedAncestor})
    if (fixedAncestor !== element && isFixedAncestorScrollable) {
      const fixedAncestorInnerOffset = getElementInnerOffset({element: fixedAncestor})
      rect.x += fixedAncestorInnerOffset.x
      rect.y += fixedAncestorInnerOffset.y
    }
  } else {
    const documentInnerOffset = getElementInnerOffset()
    rect.x += documentInnerOffset.x
    rect.y += documentInnerOffset.y
  }
  return rect
}
