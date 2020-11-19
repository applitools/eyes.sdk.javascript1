'use strict'
const mapValues = require('lodash.mapvalues')
const {URL} = require('url')
const {RGridResource} = require('@applitools/eyes-sdk-core')
const absolutizeUrl = require('./absolutizeUrl')
const resourceType = require('./resourceType')
const toCacheEntry = require('./toCacheEntry')
const extractSvgResources = require('./extractSvgResources')
const getFetchOptions = require('./getFetchOptions')

// NOTE regarding support for errorStatusCode:
// why is this function still valid? because it is meant to add resources to the return value of getAllResources, if and only if it's not already there OR it is there but there is no content (for some reason I don't remember).
// when handling errorStatusCode resources, they are added if they are not already there, and if they are there, they will never have content so it's fine.
function assignContentfulResources(obj1, obj2) {
  for (const p in obj2) {
    if (!obj1[p] || !obj1[p].getContent()) {
      obj1[p] = obj2[p]
    }
  }
}

function fromCacheToRGridResource({url, type, hash, content, errorStatusCode}) {
  const resource = new RGridResource({url})
  if (errorStatusCode) {
    resource.setErrorStatusCode(errorStatusCode)
  } else {
    resource.setContentType(type)
    resource.setContent(content || '')
    // yuck! but RGridResource assumes it always has the content, which we prefer not to save in cache.
    // after renderBatch we clear the content of the resource, for saving space.
    resource._sha256hash = hash
  }
  return resource
}

function makeGetAllResources({resourceCache, fetchResource, extractCssResources, logger}) {
  function fromFetchedToRGridResource({url, type, value, errorStatusCode}) {
    const rGridResource = new RGridResource({url})
    if (errorStatusCode) {
      rGridResource.setErrorStatusCode(errorStatusCode)
    } else {
      rGridResource.setContentType(type || 'application/x-applitools-unknown') // TODO test this
      rGridResource.setContent(value || '')
      if (!value) {
        logger.log(`warning! the resource ${url} ${type} has no content.`)
      }
    }
    return rGridResource
  }

  return function getAllResources({resourceUrls, preResources, userAgent, referer, proxySettings}) {
    const handledResources = new Set()
    return getOrFetchResources(resourceUrls, preResources)

    async function getOrFetchResources(resourceUrls = [], preResources = {}) {
      const resources = {}
      for (const [url, resource] of Object.entries(preResources)) {
        // "preResources" are not fetched and not in "fetchCache" so cache them to "resourceCache".
        const rGridResource = fromFetchedToRGridResource(resource)
        resourceCache.setValue(url, toCacheEntry(rGridResource))
        handledResources.add(url)
        assignContentfulResources(resources, {[url]: rGridResource})
      }

      const unhandledResourceUrls = resourceUrls.filter(url => !handledResources.has(url))
      const missingResourceUrls = []
      for (const url of unhandledResourceUrls) {
        handledResources.add(url)
        const cacheEntry = resourceCache.getWithDependencies(url)
        if (cacheEntry) {
          assignContentfulResources(resources, mapValues(cacheEntry, fromCacheToRGridResource))
        } else if (/^https?:$/i.test(new URL(url).protocol)) {
          missingResourceUrls.push(url)
        }
      }

      await Promise.all(
        missingResourceUrls.map(async url => {
          try {
            const fetchOptions = getFetchOptions({url, referer, userAgent, proxySettings})
            const resource = await fetchResource(url, fetchOptions)
            return assignContentfulResources(resources, await processResource(resource))
          } catch (err) {
            logger.log(
              `error fetching resource at ${url}, setting errorStatusCode to 504. err=${err}`,
            )
            resources[url] = new RGridResource({url, errorStatusCode: 504})
          }
        }),
      )

      return resources
    }

    async function processResource(resource) {
      let {dependentResources, fetchedResources} = await getDependantResources(resource)
      const rGridResource = fromFetchedToRGridResource(resource)
      // It is time consuming to process css/svg so use "resourceCache".
      const doesRequireProcessing = !!resourceType(rGridResource.getContentType())
      if (doesRequireProcessing) {
        resourceCache.setValue(resource.url, toCacheEntry(rGridResource))
      }
      resourceCache.setDependencies(resource.url, dependentResources)
      return Object.assign({[resource.url]: rGridResource}, fetchedResources)
    }

    async function getDependantResources({url, type, value}) {
      let dependentResources, fetchedResources
      const rType = resourceType(type)

      try {
        if (rType === 'CSS') {
          dependentResources = extractCssResources(value.toString())
        } else if (rType === 'SVG') {
          dependentResources = extractSvgResources(value.toString())
        }
      } catch (e) {
        logger.log(`could not parse ${rType} ${url}`, e)
      }

      if (dependentResources) {
        dependentResources = dependentResources.map(u => absolutizeUrl(u, url))
        fetchedResources = await getOrFetchResources(dependentResources)
      }
      return {dependentResources, fetchedResources}
    }
  }
}

module.exports = makeGetAllResources
