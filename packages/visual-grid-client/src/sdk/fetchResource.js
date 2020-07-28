'use strict'
const retryFetch = require('@applitools/http-commons/src/retryFetch')
const createResourceCache = require('./createResourceCache')

function makeFetchResource({logger, retries = 5, fetchCache = createResourceCache(), fetch}) {
  return (url, opts) =>
    fetchCache.getValue(url) || fetchCache.setValue(url, doFetchResource(url, opts))

  function doFetchResource(url, opts) {
    return retryFetch(
      async retry => {
        const retryStr = retry ? `(retry ${retry}/${retries})` : ''
        const optsStr = JSON.stringify(opts) || ''
        logger.verbose(`fetching ${url} ${retryStr} ${optsStr}`)

        const resp = await fetch(url, opts)
        if (!resp.ok) {
          logger.verbose(`failed to fetch ${url} status ${resp.status}, returning errorStatusCode`)
          return {url, errorStatusCode: resp.status}
        }

        logger.verbose(`fetched ${url}`)
        const buffer = await (resp.buffer ? resp.buffer() : resp.arrayBuffer())
        return {
          url,
          type: resp.headers.get('Content-Type'),
          value: Buffer.from(buffer),
        }
      },
      {retries},
    )
  }
}

module.exports = makeFetchResource
