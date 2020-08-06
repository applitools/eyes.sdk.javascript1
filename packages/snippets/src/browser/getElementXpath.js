function generateElementXpath({element} = {}) {
  let xpath = ''
  const ownerDocument = element.ownerDocument
  if (!ownerDocument) return xpath // this is the document node
  let targetElement = element
  while (targetElement !== ownerDocument) {
    const index = Array.prototype.filter
      .call(targetElement.parentNode.childNodes, node => node.tagName === targetElement.tagName)
      .indexOf(targetElement)
    xpath = `/${targetElement.tagName}[${index + 1}]${xpath}`
    targetElement = targetElement.parentNode
  }
  return xpath
}

module.exports = generateElementXpath
