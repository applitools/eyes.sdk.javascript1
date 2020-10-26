function blurElement([element] = []) {
  const activeElement = element || document.activeElement
  if (activeElement) activeElement.blur()
  return activeElement
}

module.exports = blurElement
