function cleanupElementIds([elements]) {
  elements.forEach(el => {
    el.removeAttribute('data-eyes-selector')
  })
}

module.exports = cleanupElementIds
