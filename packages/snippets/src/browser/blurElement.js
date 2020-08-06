function blurElement({element = document.activeElement} = {}) {
  if (element) element.blur()
  return element
}

module.exports = blurElement
