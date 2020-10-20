function setElementStyleProperties([element, properties] = []) {
  const keys = Object.keys(properties).sort()
  const original = keys.reduce((original, prop) => {
    original[prop] = {
      value: element.style.getPropertyValue(prop),
      important: Boolean(element.style.getPropertyPriority(prop)),
    }
    return original
  }, {})

  keys.forEach(prop => {
    element.style.setProperty(
      prop,
      typeof properties[prop] === 'string' || !properties[prop]
        ? properties[prop]
        : properties[prop].value,
      properties[prop] && properties[prop].important ? 'important' : '',
    )
  })
  return original
}

module.exports = setElementStyleProperties
