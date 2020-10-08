function setElementAttributes([element, attributes] = []) {
  return Object.keys(attributes).reduce((original, attribute) => {
    original[attribute] = element.getAttribute(attribute)
    element.setAttribute(attribute, attributes[attribute])
    return original
  }, {})
}

module.exports = setElementAttributes
