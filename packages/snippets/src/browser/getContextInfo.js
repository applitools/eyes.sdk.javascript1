const getElementXpath = require('./getElementXpath')

function getContextInfo() {
  let isRoot
  try {
    isRoot = window.top.document === window.document
  } catch (err) {
    isRoot = false
  }
  let isCORS
  try {
    isCORS = !window.parent.document === window.document
  } catch (err) {
    isCORS = true
  }
  let selector
  if (!isCORS) {
    try {
      selector = getElementXpath([window.frameElement])
    } catch (err) {
      selector = null
    }
  }
  return [document.documentElement, selector, isRoot, isCORS]
}

module.exports = getContextInfo
