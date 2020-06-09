'use strict'
const cwd = process.cwd()
const {
  Eyes,
  VisualGridRunner,
  StitchMode,
  BatchInfo,
  ConsoleLogHandler,
  Configuration,
} = require(cwd)

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

const Browsers = {
  chrome({headless = !process.env.NO_HEADLESS} = {}) {
    const args = []
    if (headless) args.push('headless')
    return {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args,
      },
    }
  },
  firefox({headless = !process.env.NO_HEADLESS} = {}) {
    const args = []
    if (headless) args.push('headless')
    return {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args,
      },
    }
  },
}

const batch = new BatchInfo(process.env.APPLITOOLS_BATCH_NAME || 'JS Coverage Tests')

function getEyes({isVisualGrid, isCssStitching, configuration, branchName = 'master'} = {}) {
  const eyes = new Eyes(isVisualGrid ? new VisualGridRunner(10) : undefined)
  const conf = new Configuration(
    Object.assign({}, configuration, {
      batch,
      branchName,
      parentBranchName: 'master',
      dontCloseBatches: true,
    }),
  )
  if (isCssStitching) {
    conf.setStitchMode(StitchMode.CSS)
  }
  if (process.env['APPLITOOLS_API_KEY_SDK']) {
    conf.setApiKey(process.env['APPLITOOLS_API_KEY_SDK'])
  }
  eyes.setConfiguration(conf)

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  return eyes
}

module.exports = {
  Browsers,
  getEyes,
  batch,
  sauceUrl: SAUCE_SERVER_URL,
}
