'use strict'
const {Builder} = require('selenium-webdriver')
const {Eyes, StitchMode, GeneralUtils} = require('../../../../index')
const defaultArgs = process.env.NO_HEADLESS ? [] : ['headless']

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'
const batch = {
  id: GeneralUtils.guid(),
  name: 'JS Selenium 3 SDK',
  startedAt: new Date().toUTCString(),
}

const Browsers = {
  CHROME: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: defaultArgs,
    },
  },
  FIREFOX: {
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: defaultArgs,
    },
  },
}

async function getDriver(browser) {
  let capabilities = Browsers[browser]
  return new Builder().withCapabilities(capabilities).build()
}

function getEyes(stitchMode) {
  let eyes = new Eyes()
  setStitchMode()
  eyes.setBranchName('master')
  if (process.env['APPLITOOLS_API_KEY_SDK']) {
    eyes.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
  }
  eyes.setBatch(batch)
  return eyes

  function setStitchMode() {
    stitchMode === 'CSS'
      ? eyes.setStitchMode(StitchMode.CSS)
      : eyes.setStitchMode(StitchMode.SCROLL)
  }
}

module.exports = {
  getDriver: getDriver,
  getEyes: getEyes,
  batch: batch,
  sauceUrl: SAUCE_SERVER_URL,
}
