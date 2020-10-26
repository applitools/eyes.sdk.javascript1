function cleanupElementMarkers([elements]) {
  elements.forEach(element => element.removeAttribute('data-applitools-marker'))
}

module.exports = cleanupElementMarkers
