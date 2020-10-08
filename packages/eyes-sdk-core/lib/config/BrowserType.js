const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof BrowserTypes>} BrowserType
 */

const BrowserTypes = Enum('BrowserType', {
  /** @type {'chrome'} */
  CHROME: 'chrome',
  /** @type {'firefox'} */
  FIREFOX: 'firefox',
  /** @type {'ie'} */
  IE_11: 'ie',
  /** @type {'ie10'} */
  IE_10: 'ie10',
  /** @type {'edge'} */
  EDGE: 'edge',
  /** @type {'edgechromium'} */
  EDGE_CHROMIUM: 'edgechromium',
  /** @type {'edgelegacy'} */
  EDGE_LEGACY: 'edgelegacy',
  /** @type {'safari'} */
  SAFARI: 'safari',
  /** @type {'chrome-one-version-back'} */
  CHROME_ONE_VERSION_BACK: 'chrome-one-version-back',
  /** @type {'chrome-two-versions-back'} */
  CHROME_TWO_VERSIONS_BACK: 'chrome-two-versions-back',
  /** @type {'firefox-one-version-back'} */
  FIREFOX_ONE_VERSION_BACK: 'firefox-one-version-back',
  /** @type {'firefox-two-versions-back'} */
  FIREFOX_TWO_VERSIONS_BACK: 'firefox-two-versions-back',
  /** @type {'safari-one-version-back'} */
  SAFARI_ONE_VERSION_BACK: 'safari-one-version-back',
  /** @type {'safari-two-versions-back'} */
  SAFARI_TWO_VERSIONS_BACK: 'safari-two-versions-back',
  /** @type {'edgechromium-one-version-back'} */
  EDGE_CHROMIUM_ONE_VERSION_BACK: 'edgechromium-one-version-back',
  /** @type {'edgechromium-two-versions-back'} */
  EDGE_CHROMIUM_TWO_VERSIONS_BACK: 'edgechromium-two-versions-back',
})

module.exports = BrowserTypes
