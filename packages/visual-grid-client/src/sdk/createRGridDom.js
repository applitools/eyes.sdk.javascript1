'use strict';

const {RGridResource} = require('@applitools/eyes-sdk-core');

function createRGridDom({cdt, resources}) {
  const resourceArr = Object.values(resources).sort((r1, r2) =>
    r1.getUrl() > r2.getUrl() ? 1 : -1,
  );

  const domResources = resourceArr.reduce((acc, resource) => {
    acc[resource.getUrl()] = resource.getHashAsObject();
    return acc;
  }, {});

  const content = Buffer.from(
    JSON.stringify({
      resources: domResources,
      domNodes: cdt,
    }),
  );

  return new RGridResource({content, contentType: 'x-applitools-html/cdt'});
}

module.exports = createRGridDom;
