function getScrollOffset({element} = {}) {
  if (element) {
    return {x: element.scrollLeft, y: element.scrollTop}
  } else {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    }
  }
}

module.exports = getScrollOffset
