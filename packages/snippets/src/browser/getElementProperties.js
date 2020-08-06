function getElementProperties({element, properties = []} = {}) {
  return properties.reduce((properties, property) => {
    properties[property] = element[property]
    return properties
  }, {})
}

module.exports = getElementProperties
