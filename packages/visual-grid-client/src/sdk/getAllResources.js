'use strict';
const mapValues = require('lodash.mapvalues');
const {URL} = require('url');
const {RGridResource} = require('@applitools/eyes-sdk-core');
const absolutizeUrl = require('./absolutizeUrl');
const resourceType = require('./resourceType');
const toCacheEntry = require('./toCacheEntry');
const extractSvgResources = require('./extractSvgResources');

function assignContentfulResources(obj1, obj2) {
  for (const p in obj2) {
    if (!obj1[p] || !obj1[p].getContent()) {
      obj1[p] = obj2[p];
    }
  }
}

function fromCacheToRGridResource({url, type, hash, content}) {
  const resource = new RGridResource();
  resource.setUrl(url);
  resource.setContentType(type);
  content && resource.setContent(content);
  resource._sha256hash = hash; // yuck! but RGridResource assumes it always has the content, which we prefer not to save in cache.
  return resource;
}

function fromFetchedToRGridResource({url, type, value}) {
  const rGridResource = new RGridResource();
  rGridResource.setUrl(url);
  rGridResource.setContentType(type || 'application/x-applitools-unknown'); // TODO test this
  rGridResource.setContent(value);
  return rGridResource;
}

function makeGetAllResources({resourceCache, fetchResource, extractCssResources, logger}) {
  return function getAllResources({resourceUrls, preResources, fetchOptions}) {
    const handledResources = new Set();
    return getOrFetchResources(resourceUrls, preResources);

    async function getOrFetchResources(resourceUrls = [], preResources = {}) {
      const resources = {};
      for (const [url, resource] of Object.entries(preResources)) {
        resourceCache.setValue(url, toCacheEntry(fromFetchedToRGridResource(resource)));
        handledResources.add(url);
        const rGridResource = fromFetchedToRGridResource(resource);
        assignContentfulResources(resources, {[url]: rGridResource});
      }

      const unhandledResourceUrls = resourceUrls.filter(url => !handledResources.has(url));
      const missingResourceUrls = [];
      for (const url of unhandledResourceUrls) {
        handledResources.add(url);
        const cacheEntry = resourceCache.getWithDependencies(url);
        if (cacheEntry) {
          assignContentfulResources(resources, mapValues(cacheEntry, fromCacheToRGridResource));
        } else if (/^https?:$/i.test(new URL(url).protocol)) {
          missingResourceUrls.push(url);
        }
      }

      await Promise.all(
        missingResourceUrls.map(url =>
          fetchResource(url, fetchOptions)
            .then(async resource =>
              assignContentfulResources(resources, await processResource(resource)),
            )
            .catch(ex => {
              logger.log(`error fetching resource at ${url}: ${ex}`);
            }),
        ),
      );

      return resources;
    }

    async function processResource(resource) {
      let {dependentResources, fetchedResources} = await getDependantResources(resource);
      const rGridResource = fromFetchedToRGridResource(resource);
      /*
       * Note: We set the cache with resources only after we don't need their content anymore (to save up space);
       * We set it in renderBatch() after all PUTs are done.
       * ( toCacheEntry() removes the content of non css/svg resources )
       *
       * getAllresources calls before the render ends don't get the cache (it's ok fetch-wise since fetch is cached)
       * but it is time consuming to do css/svg processing - and so we set these resources to cache here.
       *
       * Consider changing this, maybe setting all resources here (and keeping the cache entery content).
       */
      const contentType = rGridResource.getContentType();
      if (resourceType(contentType)) {
        resourceCache.setValue(resource.url, toCacheEntry(rGridResource));
      }
      resourceCache.setDependencies(resource.url, dependentResources);
      return Object.assign({[resource.url]: rGridResource}, fetchedResources);
    }

    async function getDependantResources({url, type, value}) {
      let dependentResources, fetchedResources;
      const rType = resourceType(type);

      try {
        if (rType === 'CSS') {
          dependentResources = extractCssResources(value.toString());
        } else if (rType === 'SVG') {
          dependentResources = extractSvgResources(value.toString());
        }
      } catch (e) {
        logger.log(`could not parse ${rType} ${url}`, e);
      }

      if (dependentResources) {
        dependentResources = dependentResources.map(u => absolutizeUrl(u, url));
        fetchedResources = await getOrFetchResources(dependentResources);
      }
      return {dependentResources, fetchedResources};
    }
  };
}

module.exports = makeGetAllResources;
