'use strict'

const {RenderRequest, RenderInfo} = require('@applitools/eyes-sdk-core')
const createEmulationInfo = require('./createEmulationInfo')
const calculateSelectorsToFindRegionsFor = require('./calculateSelectorsToFindRegionsFor')

function createRenderRequests({
  url,
  resources,
  dom,
  browsers,
  renderInfo,
  sizeMode,
  selector,
  region,
  scriptHooks,
  noOffsetSelectors = [],
  offsetSelectors = [],
  sendDom,
  visualGridOptions,
}) {
  const selectorsToFindRegionsFor = calculateSelectorsToFindRegionsFor({
    sizeMode,
    selector,
    noOffsetSelectors,
    offsetSelectors,
  })

  return browsers.map(
    ({
      width,
      height,
      name,
      deviceName,
      screenOrientation,
      deviceScaleFactor,
      mobile,
      platform,
      iosDeviceInfo,
    }) => {
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
        resources,
        dom,
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
    },
  )
}

module.exports = createRenderRequests
