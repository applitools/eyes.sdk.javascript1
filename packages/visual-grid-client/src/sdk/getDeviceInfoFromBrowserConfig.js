'use strict'

function getDeviceInfoFromBrowserConfig(browser) {
  const chromeEmulationDeviceName =
    browser.deviceName || (browser.chromeEmulationInfo && browser.chromeEmulationInfo.deviceName)

  if (chromeEmulationDeviceName) {
    return `${chromeEmulationDeviceName} (Chrome emulation)`
  }

  if (browser.iosDeviceInfo) {
    return browser.iosDeviceInfo.deviceName
  }

  return 'Desktop'
}

module.exports = getDeviceInfoFromBrowserConfig
