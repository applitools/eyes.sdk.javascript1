function scrollTo([element, offset] = []) {
  element = element || document.documentElement
  if (element.scrollTo) {
    element.scrollTo(offset.x, offset.y)
  } else {
    element.scrollLeft = offset.x
    element.scrollTop = offset.y
  }
  return {x: element.scrollLeft, y: element.scrollTop}
}

module.exports = scrollTo
