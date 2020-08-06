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
      selector = getElementXpath({element: window.frameElement})
    } catch (err) {
      selector = null
    }
  }
  return {isRoot, isCORS, selector, documentElement: document.documentElement}
}

module.exports = getContextInfo
