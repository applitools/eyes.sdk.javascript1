'use strict'
const {URL} = require('url')

class CorsIframeHandler {
  /**
   * @param {object} json
   * @param {string} origin
   */
  static blankCorsIframeSrc(json, origin) {
    if (json.tagName === 'IFRAME') {
      if (json.attributes.src) {
        const frameUrl = new URL(json.attributes.src, origin)
        if (origin !== frameUrl.origin) {
          json.attributes.src = ''
        }
      }
    }

    if (json.childNodes) {
      for (const child of json.childNodes) {
        CorsIframeHandler.blankCorsIframeSrc(child, origin)
      }
    }
  }

  /**
   * @param page
   * @param {string} page.url
   * @param {object[]} page.cdt
   * @param {object[]} page.frames
   * @return {object[]}
   */
  static blankCorsIframeSrcOfCdt({url, cdt, frames}) {
    const frameUrls = new Set(frames.map(frame => frame.url))
    cdt.map(node => {
      if (node.nodeName === 'IFRAME') {
        const srcAttr = node.attributes.find(attr => attr.name === 'src')
        const absoluteSrcAttr = srcAttr && new URL(srcAttr.value, url).href
        if (absoluteSrcAttr && !frameUrls.has(absoluteSrcAttr)) {
          srcAttr.value = ''
        }
      }
      return node
    })

    for (const frame of frames) {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(frame)
    }

    return cdt
  }
}

module.exports = CorsIframeHandler
