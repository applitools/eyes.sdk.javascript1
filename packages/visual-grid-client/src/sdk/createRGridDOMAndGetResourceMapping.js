'use strict';

const createRGridDom = require('./createRGridDom');

function makeCreateRGridDOMAndGetResourceMapping({getAllResources}) {
  return async function createRGridDOMAndGetResourceMapping({
    cdt,
    resourceUrls,
    resourceContents,
    frames = [],
    fetchOptions,
  }) {
    const resources = await getAllResources({
      resourceUrls,
      preResources: resourceContents,
      fetchOptions,
    });
    const allResources = Object.assign({}, resources);

    const frameDoms = await Promise.all(frames.map(createRGridDOMAndGetResourceMapping));

    frameDoms.forEach(({rGridDom: frameDom, allResources: frameAllResources}, i) => {
      const frameUrl = frames[i].url;
      frameDom.setUrl(frameUrl);
      allResources[frameUrl] = resources[frameUrl] = frameDom;
      Object.assign(allResources, frameAllResources);
    });

    Object.assign(allResources, resources);

    const rGridDom = createRGridDom({cdt, resources});

    return {rGridDom, allResources};
  };
}

module.exports = makeCreateRGridDOMAndGetResourceMapping;
