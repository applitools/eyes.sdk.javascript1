function getElementEntireSize({element} = {}) {
  return {
    width: Math.max(element.clientWidth, element.scrollWidth),
    height: Math.max(element.clientHeight, element.scrollHeight),
  }
}

module.exports = getElementEntireSize
