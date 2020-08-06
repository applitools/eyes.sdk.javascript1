function getDocumentEntireSize() {
  const scrollWidth = document.documentElement.scrollWidth
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  const bodyScrollWidth = document.body.scrollWidth
  const bodyScrollHeight = document.body.scrollHeight
  const bodyClientHeight = document.body.clientHeight

  const width = Math.max(scrollWidth, bodyScrollWidth)
  const height = Math.max(clientHeight, scrollHeight, bodyClientHeight, bodyScrollHeight)
  return {width, height}
}

module.exports = getDocumentEntireSize
