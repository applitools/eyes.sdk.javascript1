function markElements([elements, ids]) {
  elements.forEach((el, index) => {
    el.setAttribute('data-eyes-selector', ids[index])
  })
}

module.exports = markElements
