const setElementStyleProperties = require('./setElementStyleProperties')

function addPageMarker() {
  const marker = document.createElement('div')
  const contrast = document.createElement('div')
  marker.appendChild(contrast)
  document.body.appendChild(marker)
  marker.setAttribute('data-applitools-marker', '')

  marker.style.setProperty('position', 'fixed', 'important')
  marker.style.setProperty('top', '0', 'important')
  marker.style.setProperty('left', '0', 'important')
  marker.style.setProperty('width', '3px', 'important')
  marker.style.setProperty('height', '9px', 'important')
  marker.style.setProperty('box-sizing', 'content-box', 'important')
  marker.style.setProperty('border', '1px solid rgb(127,127,127)', 'important')
  marker.style.setProperty('background', 'rgb(0,0,0)', 'important')
  marker.style.setProperty('z-index', '999999999', 'important')

  contrast.style.setProperty('width', '3px', 'important')
  contrast.style.setProperty('height', '3px', 'important')
  contrast.style.setProperty('margin', '3px 0', 'important')
  contrast.style.setProperty('background', 'rgb(255,255,255)', 'important')

  const transform = {value: 'none', important: true}
  const html = setElementStyleProperties([
    document.documentElement,
    {transform, '-webkit-transform': transform},
  ])
  const body = setElementStyleProperties([
    document.body,
    {transform, '-webkit-transform': transform},
  ])

  document.documentElement.setAttribute('data-applitools-original-transforms', JSON.stringify(html))
  document.body.setAttribute('data-applitools-original-transforms', JSON.stringify(body))

  return {
    offset: 1 * window.devicePixelRatio,
    size: 3 * window.devicePixelRatio,
    mask: [0, 1, 0],
  }
}

module.exports = addPageMarker
