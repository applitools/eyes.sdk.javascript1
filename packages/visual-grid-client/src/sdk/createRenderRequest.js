'use strict'

const {RenderRequest, RenderInfo} = require('@applitools/eyes-sdk-core')
const createEmulationInfo = require('./createEmulationInfo')

function createRenderRequest({
  url,
  dom,
  resources,
  browser,
  renderInfo,
  sizeMode,
  selector,
  selectorsToFindRegionsFor,
  region,
  scriptHooks,
  sendDom,
  visualGridOptions,
}) {
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
    resources,
    dom,
    enableMultipleResultsPerSelector: true,
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
}

module.exports = createRenderRequest
