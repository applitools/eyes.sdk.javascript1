'use strict'
const {remote} = require('webdriverio')
const {Eyes, ClassicRunner, VisualGridRunner, StitchMode, BatchInfo} = require('../../../../index')
const defaultArgs = process.env.HEADLESS === 'true' ? ['headless'] : []

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

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

const batch = new BatchInfo('WDIO 5 Coverage Tests')

async function getDriver(browser) {
  let capabilities = Browsers[browser]
  const driver = remote({
    logLevel: 'silent',
    desiredCapabilities: capabilities,
  })
  await driver.init()
  return {driver}
}

function getEyes(runnerType, stitchMode, options) {
  let runner, eyes
  switch (runnerType) {
    case 'VG':
    case 'visualGrid':
      runner = new VisualGridRunner(10)
      eyes = new Eyes(runner)
      break
    case 'classic':
      runner = new ClassicRunner()
      eyes = new Eyes(runner)
      setStitchMode()
      break
    default:
      eyes = new Eyes()
      setStitchMode()
  }
  if (options) {
    if (options.branchName) eyes.setBranchName(options.branchName)
    else eyes.setBranchName('master')
    if (options.config) eyes.setConfiguration(options.config)
  } else setDefault()
  return {eyes: eyes, runner: runner}

  function setStitchMode() {
    stitchMode === 'CSS'
      ? eyes.setStitchMode(StitchMode.CSS)
      : eyes.setStitchMode(StitchMode.SCROLL)
  }

  function setDefault() {
    eyes.setParentBranchName('master')
    eyes.setBatch(batch)
  }
}

function getBatch() {
  return batch
}

module.exports = {
  getDriver: getDriver,
  getEyes: getEyes,
  getBatch: getBatch,
  sauceUrl: SAUCE_SERVER_URL,
}
