function setElementMarkers([elements, ids]) {
  elements.forEach((element, index) => {
    const id = element.getAttribute('data-applitools-marker')
    element.setAttribute('data-applitools-marker', id ? `${id} ${ids[index]}` : ids[index])
  })
}

module.exports = setElementMarkers
