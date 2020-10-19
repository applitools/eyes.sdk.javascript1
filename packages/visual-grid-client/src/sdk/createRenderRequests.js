'use strict'

const {RenderRequest, RenderInfo} = require('@applitools/eyes-sdk-core')
const createEmulationInfo = require('./createEmulationInfo')

function createRenderRequests({
  url,
  pages,
  browsers,
  renderInfo,
  sizeMode,
  selector,
  region,
  selectorsToFindRegionsFor,
  scriptHooks,
  sendDom,
  visualGridOptions,
}) {
  return browsers.map((browser, index) => {
    const {
      width,
      height,
      name,
      deviceName,
      screenOrientation,
      deviceScaleFactor,
      mobile,
      platform,
      iosDeviceInfo,
    } = browser
    const emulationInfo = createEmulationInfo({
      deviceName,
      screenOrientation,
      deviceScaleFactor,
      mobile,
      width,
      height,
    })
    const filledBrowserName = iosDeviceInfo && !name ? 'safari' : name
    const filledPlatform = iosDeviceInfo && !platform ? 'ios' : platform

    return new RenderRequest({
      webhook: renderInfo.getResultsUrl(),
      stitchingService: renderInfo.getStitchingServiceUrl(),
      url,
      resources: Object.values(pages[index].allResources),
      dom: pages[index].rGridDom,
      renderInfo: new RenderInfo({
        width,
        height,
        sizeMode,
        selector,
        region,
        emulationInfo,
        iosDeviceInfo,
      }),
      browserName: filledBrowserName,
      scriptHooks,
      selectorsToFindRegionsFor,
      sendDom,
      platform: filledPlatform,
      visualGridOptions,
    })
  })
}

module.exports = createRenderRequests
