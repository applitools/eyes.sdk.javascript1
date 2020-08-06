function isElementScrollable({element} = {}) {
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
}

module.exports = isElementScrollable
