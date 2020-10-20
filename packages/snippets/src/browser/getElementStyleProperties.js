function getElementStyleProperties([element, properties = []] = []) {
  return properties.reduce((style, prop) => {
    style[prop] = {
      value: element.style.getPropertyValue(prop),
      important: Boolean(element.style.getPropertyPriority(prop)),
    }
    return style
  }, {})
}

module.exports = getElementStyleProperties
