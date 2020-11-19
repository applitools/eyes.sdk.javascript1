'use strict'
const throat = require('throat')
const toCacheEntry = require('./toCacheEntry')
const resourceType = require('./resourceType')

function makePutResources({
  logger,
  doPutResource,
  doCheckResources,
  resourceCache,
  fetchCache,
  timeout = 300,
  concurrency = 100,
}) {
  const putResource = throat(concurrency, doPutResource)
  const uploadedResources = new Set()
  const requestedResources = new Map()
  let pendingResources = new Map()
  let throttleTimer = false

  return async function(resources = []) {
    const promises = resources.map(resource => {
      const hash = resource.getContent() ? resource.getSha256Hash() : null
      if (!hash || uploadedResources.has(hash)) {
        return Promise.resolve()
      } else if (requestedResources.has(hash)) {
        return Promise.resolve(requestedResources.get(hash))
      } else {
        const promise = new Promise((resolve, reject) => {
          pendingResources.set(resource, {
            resolve: result => {
              requestedResources.delete(hash)
              uploadedResources.add(hash)
              return resolve(result)
            },
            reject: err => {
              requestedResources.delete(hash)
              return reject(err)
            },
          })
        })
        requestedResources.set(hash, promise)
        return promise
      }
    }, [])
    if (!throttleTimer) {
      throttleTimer = true
      setTimeout(() => {
        putResources(pendingResources)
        pendingResources = new Map()
        throttleTimer = false
      }, timeout)
    }
    const result = await Promise.all(promises)
    for (const resource of resources) {
      const url = resource.getUrl()
      logger.verbose('setting resource to cache: ', url)
      fetchCache.remove(url)
      const doesRequireProcessing = Boolean(resourceType(resource.getContentType()))
      resourceCache.setValue(url, toCacheEntry(resource, doesRequireProcessing))
    }
    return result
  }

  async function putResources(requests) {
    try {
      const resources = Array.from(requests.keys())
      const presentedResources = await doCheckResources(resources)

      for (const [index, presented] of presentedResources.entries()) {
        const resource = resources[index]
        const {resolve, reject} = requests.get(resource)
        if (presented) {
          resolve()
        } else {
          putResource(resource).then(resolve, reject)
        }
      }
    } catch (err) {
      requests.forEach(({reject}) => reject(err))
    }
  }
}

module.exports = makePutResources
