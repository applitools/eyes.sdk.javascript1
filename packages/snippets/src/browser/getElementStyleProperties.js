function getElementStyleProperties({element, properties = []} = {}) {
  return properties.reduce((style, property) => {
    style[property] = element.style[property]
    return style
  }, {})
}

module.exports = getElementStyleProperties
