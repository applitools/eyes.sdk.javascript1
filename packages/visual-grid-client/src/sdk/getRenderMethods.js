'use strict'

function getRenderMethods(renderWrapper) {
  const doGetRenderInfo = renderWrapper.getRenderInfo.bind(renderWrapper)
  const doRenderBatch = renderWrapper.renderBatch.bind(renderWrapper)
  const doCheckResources = renderWrapper.checkResources.bind(renderWrapper)
  const doPutResource = renderWrapper.putResource.bind(renderWrapper)
  const doGetRenderStatus = renderWrapper.getRenderStatus.bind(renderWrapper)
  const setRenderingInfo = renderWrapper.setRenderingInfo.bind(renderWrapper)
  const doGetRenderJobInfo = renderWrapper.getRenderJobInfo.bind(renderWrapper)
  const doLogEvents = renderWrapper.logEvents.bind(renderWrapper)
  return {
    doGetRenderInfo,
    doRenderBatch,
    doCheckResources,
    doPutResource,
    doGetRenderStatus,
    setRenderingInfo,
    doGetRenderJobInfo,
    doLogEvents,
  }
}

module.exports = getRenderMethods
