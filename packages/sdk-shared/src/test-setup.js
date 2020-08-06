'use strict'
const {URL} = require('url')
const cwd = process.cwd()
const {
  StitchMode,
  BatchInfo,
  Configuration,
  Eyes,
  VisualGridRunner,
  ConsoleLogHandler,
} = require(cwd)

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

const SAUCE_CREDENTIALS = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
}

const DEVICES = {
  'Android Emulator': {
    capabilities: {
      deviceName: 'Android Emulator',
      platformName: 'Android',
      platformVersion: '6.0',
      deviceOrientation: 'landscape',
      clearSystemFiles: true,
      noReset: true,
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'Pixel 3a XL': {
    capabilities: {
      deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
      platformName: 'Android',
      platformVersion: '10.0',
      deviceOrientation: 'portrait',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'Samsung Galaxy S8': {
    capabilities: {
      browserName: '',
      name: 'Android Demo',
      platformName: 'Android',
      platformVersion: '7.0',
      appiumVersion: '1.17.1',
      deviceName: 'Samsung Galaxy S8 FHD GoogleAPI Emulator',
      automationName: 'uiautomator2',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
}

const BROWSERS = {
  'edge-18': {
    capabilities: {
      name: 'Edge 18',
      browserName: 'MicrosoftEdge',
      browserVersion: '18',
      platformName: 'Windows 10',
      screenResolution: '1920x1080',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'ie-11': {
    capabilities: {
      name: 'IE 11',
      browserName: 'internet explorer',
      browserVersion: '11.285',
      platformName: 'Windows 10',
      screenResolution: '1920x1080',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'safari-11': {
    capabilities: {
      name: 'Safari 11',
      seleniumVersion: '3.4.0',
      browserName: 'safari',
      browserVersion: '11.0',
      platformName: 'macOS 10.12',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'safari-12': {
    capabilities: {
      name: 'Safari 12',
      seleniumVersion: '3.4.0',
      browserName: 'safari',
      browserVersion: '12.1',
      platformName: 'macOS 10.13',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  firefox: {
    capabilities: {
      browserName: 'firefox',
      seleniumVersion: '3.141.59',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  chrome: {
    capabilities: {
      browserName: 'chrome',
    },
  },
}

function Env(
  {browser, app, device, url, headless = !process.env.NO_HEADLESS, ...options} = {},
  protocol = 'wd',
) {
  const env = {browser, device, headless, protocol, ...options}
  if (protocol === 'wd') {
    env.url = new URL(url || process.env.CVG_TESTS_WD_REMOTE || process.env.CVG_TESTS_REMOTE)
    env.capabilities = {
      browserName: browser,
      app,
      ...env.capabilities,
    }
    const preset = DEVICES[device] || BROWSERS[browser]
    if (preset) {
      env.url = preset.url ? new URL(preset.url) : env.url
      env.capabilities = Object.assign(env.capabilities, preset.capabilities)
    }
  } else if (protocol === 'cdp') {
    url = url || process.env.CVG_TESTS_CDP_REMOTE
    env.url = url ? new URL(url) : undefined
  }
  return env
}

const batchName = process.env.APPLITOOLS_BATCH_NAME || 'JS Coverage Tests'
const batch = typeof BatchInfo === 'undefined' ? batchName : new BatchInfo(batchName)

function getEyes({isVisualGrid, isCssStitching, configuration, branchName = 'master'} = {}) {
  const eyes = new Eyes(isVisualGrid ? new VisualGridRunner(10) : undefined)
  const conf = Object.assign(
    {
      apiKey: process.env.APPLITOOLS_API_KEY_SDK,
      batch,
      branchName,
      parentBranchName: 'master',
      dontCloseBatches: true,
      matchTimeout: 0,
      stitchMode: isCssStitching ? StitchMode.CSS : StitchMode.SCROLL,
      saveNewTests: false,
    },
    configuration,
  )
  eyes.setConfiguration(new Configuration(conf))

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  return eyes
}

module.exports = {
  Env,
  getEyes,
  batch,
}
