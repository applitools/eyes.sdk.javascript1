'use strict'

/**
 * @readonly
 * @enum {string}
 */
const BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  IE_11: 'ie',
  IE_10: 'ie10',
  EDGE: 'edge',
  EDGE_CHROMIUM: 'edgechromium',
  EDGE_LEGACY: 'edgelegacy',
  SAFARI: 'safari',
  CHROME_ONE_VERSION_BACK: 'chrome-one-version-back',
  CHROME_TWO_VERSIONS_BACK: 'chrome-two-versions-back',
  FIREFOX_ONE_VERSION_BACK: 'firefox-one-version-back',
  FIREFOX_TWO_VERSIONS_BACK: 'firefox-two-versions-back',
  SAFARI_ONE_VERSION_BACK: 'safari-one-version-back',
  SAFARI_TWO_VERSIONS_BACK: 'safari-two-versions-back',
  EDGE_CHROMIUM_ONE_VERSION_BACK: 'edgechromium-one-version-back',
}

Object.freeze(BrowserType)
exports.BrowserType = BrowserType
