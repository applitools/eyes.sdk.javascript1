function getElementComputedStyleProperties([element, properties = []] = []) {
  const computedStyle = window.getComputedStyle(element)
  return computedStyle ? properties.map(property => computedStyle.getPropertyValue(property)) : []
}

module.exports = getElementComputedStyleProperties
