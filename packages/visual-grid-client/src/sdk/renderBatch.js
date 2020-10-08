'use strict'

const {RenderStatus} = require('@applitools/eyes-sdk-core')
const toCacheEntry = require('./toCacheEntry')
const resourceType = require('./resourceType')

function makeRenderBatch({putResources, resourceCache, fetchCache, logger, doRenderBatch}) {
  return async function renderBatch(renderRequests) {
    const runningRenders = await doRenderBatch(renderRequests)

    await Promise.all(
      runningRenders.map(async (runningRender, i) => {
        const renderRequest = renderRequests[i]
        if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
          renderRequest.setRenderId(runningRender.getRenderId())
          await putResources(renderRequest.getDom(), runningRender, renderRequest.getResources())
        }
        for (const resource of renderRequest.getResources()) {
          logger.verbose('setting resource to cache: ', resource.getUrl())
          const url = resource.getUrl()
          fetchCache.remove(url)
          const doesRequireProcessing = !!resourceType(resource.getContentType())
          resourceCache.setValue(url, toCacheEntry(resource, doesRequireProcessing))
        }
      }),
    )

    if (runningRenders.some(rr => rr.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES)) {
      const runningRenders2 = await doRenderBatch(renderRequests)
      if (runningRenders2.some(rr => rr.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES)) {
        logger.log('unexpectedly got "need more resources" on second render request')
        throw new Error('Unexpected error while taking screenshot')
      }
    }

    return runningRenders.map(rr => rr.getRenderId())
  }
}

module.exports = makeRenderBatch
