'use strict'

function mapChromeEmulationInfo(browser) {
  let withEmulationInfo = browser
  if (browser.chromeEmulationInfo && browser.chromeEmulationInfo.deviceName) {
    withEmulationInfo = {...browser, ...browser.chromeEmulationInfo}
    delete withEmulationInfo.chromeEmulationInfo
  }
  return withEmulationInfo
}

module.exports = mapChromeEmulationInfo
