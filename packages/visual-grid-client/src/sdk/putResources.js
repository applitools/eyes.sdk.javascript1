'use strict';
const throat = require('throat');

const DEFAULT_CONCURRENCY_LIMIT = 100;

/************************
 *    This is PUTIN!    *
 ************************/

function makePutResources({concurrency = DEFAULT_CONCURRENCY_LIMIT, doPutResource}) {
  const putPromises = {};
  return async function putResources(domResource, runningRender, allResources = []) {
    const resources = []; // this will contain all the resources that need to be PUT (asked for + not already sent)
    const existingPromises = [];
    if (runningRender.getNeedMoreDom()) {
      processResource(domResource, resources, existingPromises);
    }

    const needMoreResources = runningRender.getNeedMoreResources();
    if (needMoreResources) {
      for (const resource of allResources) {
        if (needMoreResources.includes(resource.getUrl())) {
          processResource(resource, resources, existingPromises);
        }
      }
    }

    const newPromises = resources.map(
      throat(concurrency, resource => sendPutResource(resource, runningRender)),
    );

    return Promise.all(existingPromises.concat(newPromises));
  };

  function processResource(resource, resources, promises) {
    const resourcePromise = putPromises[resource.getSha256Hash()];
    if (resourcePromise) {
      promises.push(resourcePromise);
    } else {
      resources.push(resource);
    }
  }

  function sendPutResource(resource, runningRender) {
    const promise = doPutResource(runningRender, resource);
    putPromises[resource.getSha256Hash()] = promise;
    return promise;
  }
}

module.exports = makePutResources;
