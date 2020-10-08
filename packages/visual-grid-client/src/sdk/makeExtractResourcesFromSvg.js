'use strict'

function makeExtractResourcesFromSvg({parser, decoder, extractResourceUrlsFromStyleTags}) {
  return function(svgArrayBuffer) {
    const decooder = decoder || new TextDecoder('utf-8') // eslint-disable-line node/no-unsupported-features/node-builtins
    const svgStr = decooder.decode(svgArrayBuffer)
    const domparser = parser || new DOMParser() // eslint-disable-line no-undef
    const doc = domparser.parseFromString(svgStr, 'image/svg+xml')

    const srcsetUrls = Array.from(doc.querySelectorAll('img[srcset]'))
      .map(srcsetEl =>
        srcsetEl
          .getAttribute('srcset')
          .split(', ')
          .map(str => str.trim().split(/\s+/)[0]),
      )
      .reduce((acc, urls) => acc.concat(urls), [])

    const srcUrls = Array.from(doc.querySelectorAll('img[src]')).map(srcEl =>
      srcEl.getAttribute('src'),
    )

    const fromHref = Array.from(doc.querySelectorAll('image,use,link[rel="stylesheet"]')).map(
      e => e.getAttribute('href') || e.getAttribute('xlink:href'),
    )
    const fromObjects = Array.from(doc.getElementsByTagName('object')).map(e =>
      e.getAttribute('data'),
    )
    const fromStyleTags = extractResourceUrlsFromStyleTags(doc, false)
    const fromStyleAttrs = urlsFromStyleAttrOfDoc(doc)

    return srcsetUrls
      .concat(srcUrls)
      .concat(fromHref)
      .concat(fromObjects)
      .concat(fromStyleTags)
      .concat(fromStyleAttrs)
      .filter(u => u[0] !== '#')
  }
}

function urlsFromStyleAttrOfDoc(doc) {
  return flat(
    Array.from(doc.querySelectorAll('*[style]'))
      .map(e => e.style.cssText)
      .map(getUrlFromCssText)
      .filter(Boolean),
  )
}

function getUrlFromCssText(cssText) {
  const re = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g
  const ret = []
  let result
  while ((result = re.exec(cssText)) !== null) {
    ret.push(result[1])
  }
  return ret
}

function flat(arr) {
  return arr.reduce((flatArr, item) => flatArr.concat(item), [])
}

module.exports = makeExtractResourcesFromSvg
