function findFixedAncestor({element} = {}) {
  let offsetElement = element
  while (
    offsetElement.offsetParent &&
    offsetElement.offsetParent !== document.body &&
    offsetElement.offsetParent !== document.documentElement
  ) {
    offsetElement = offsetElement.offsetParent
  }
  const position = window.getComputedStyle(offsetElement).getPropertyValue('position')
  return position === 'fixed' ? offsetElement : null
}

module.exports = findFixedAncestor
