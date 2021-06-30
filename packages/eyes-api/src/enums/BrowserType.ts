export enum BrowserTypeEnum {
  CHROME = 'chrome',
  CHROME_ONE_VERSION_BACK = 'chrome-one-version-back',
  CHROME_TWO_VERSIONS_BACK = 'chrome-two-versions-back',
  FIREFOX = 'firefox',
  FIREFOX_ONE_VERSION_BACK = 'firefox-one-version-back',
  FIREFOX_TWO_VERSIONS_BACK = 'firefox-two-versions-back',
  IE_11 = 'ie',
  IE_10 = 'ie10',
  EDGE = 'edge',
  EDGE_CHROMIUM = 'edgechromium',
  EDGE_LEGACY = 'edgelegacy',
  EDGE_CHROMIUM_ONE_VERSION_BACK = 'edgechromium-one-version-back',
  EDGE_CHROMIUM_TWO_VERSIONS_BACK = 'edgechromium-two-versions-back',
  SAFARI = 'safari',
  SAFARI_EARLY_ACCESS = 'safari-earlyaccess',
  SAFARI_ONE_VERSION_BACK = 'safari-one-version-back',
  SAFARI_TWO_VERSIONS_BACK = 'safari-two-versions-back',
}

export type BrowserType = `${BrowserTypeEnum}`
