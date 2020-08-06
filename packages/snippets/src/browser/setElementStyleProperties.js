function setElementStyleProperties({element, properties} = {}) {
  return Object.keys(properties).reduce((original, property) => {
    original[property] = element.style[property]
    element.style[property] = properties[property]
    return original
  }, {})
}

module.exports = setElementStyleProperties
