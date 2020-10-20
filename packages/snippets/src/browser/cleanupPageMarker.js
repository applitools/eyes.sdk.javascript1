const setElementStyleProperties = require('./setElementStyleProperties')
function cleanupPageMarker() {
  const marker = document.querySelector('[data-applitools-marker]')
  if (marker) document.body.removeChild(marker)
  const html = document.documentElement.getAttribute('data-applitools-original-transforms')
  const body = document.body.getAttribute('data-applitools-original-transforms')
  if (html) setElementStyleProperties([document.documentElement, JSON.parse(html)])
  if (body) setElementStyleProperties([document.body, JSON.parse(body)])
}

module.exports = cleanupPageMarker
