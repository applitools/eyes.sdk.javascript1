function getChildFramesInfo() {
  const frames = document.querySelectorAll('frame, iframe')
  return Array.prototype.map.call(frames, frameElement => [
    frameElement,
    !frameElement.contentDocument,
    frameElement.src,
  ])
}

module.exports = getChildFramesInfo
