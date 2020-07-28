'use strict'

const createRGridDom = require('./createRGridDom')

function makeCreateRGridDOMAndGetResourceMapping({getAllResources}) {
  return async function createRGridDOMAndGetResourceMapping({
    cdt,
    resourceUrls,
    resourceContents,
    frames = [],
    userAgent,
    referer,
    proxySettings,
  }) {
    const resources = await getAllResources({
      resourceUrls,
      preResources: resourceContents,
      userAgent,
      referer,
      proxySettings,
    })
    const allResources = Object.assign({}, resources)

    const frameDoms = await Promise.all(frames.map(createRGridDOMAndGetResourceMapping))

    frameDoms.forEach(({rGridDom: frameDom, allResources: frameAllResources}, i) => {
      const frameUrl = frames[i].url
      frameDom.setUrl(frameUrl)
      allResources[frameUrl] = resources[frameUrl] = frameDom
      Object.assign(allResources, frameAllResources)
    })

    Object.assign(allResources, resources)

    const rGridDom = createRGridDom({cdt, resources})

    return {rGridDom, allResources}
  }
}

module.exports = makeCreateRGridDOMAndGetResourceMapping
