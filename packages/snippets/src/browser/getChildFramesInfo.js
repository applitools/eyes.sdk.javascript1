function getChildFramesInfo() {
  const frames = document.querySelectorAll('frame, iframe')
  return Array.prototype.map.call(frames, frameElement => ({
    isCORS: !frameElement.contentDocument,
    element: frameElement,
    src: frameElement.src,
  }))
}

module.exports = getChildFramesInfo
