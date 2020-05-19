'use strict'

function getDeviceInfoFromBrowserConfig(browser) {
  if (browser.deviceName) {
    return `${browser.deviceName} (Chrome emulation)`
  }

  if (browser.iosDeviceInfo) {
    return browser.iosDeviceInfo.name
  }

  return 'Desktop'
}

module.exports = getDeviceInfoFromBrowserConfig
