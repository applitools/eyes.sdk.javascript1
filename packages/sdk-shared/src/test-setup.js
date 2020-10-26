'use strict'
const {URL} = require('url')
const cwd = process.cwd()
const {BatchInfo, Configuration, Eyes, VisualGridRunner} = require(cwd)

const SAUCE_SERVER_URL = 'https://ondemand.saucelabs.com:443/wd/hub'

const SAUCE_CREDENTIALS = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
}

const DEVICES = {
  'Android Emulator': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      deviceName: 'Android Emulator',
      platformName: 'Android',
      platformVersion: '6.0',
      clearSystemFiles: true,
      noReset: true,
      ...SAUCE_CREDENTIALS,
    },
  },
  'Pixel 3a XL': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      deviceName: 'Google Pixel 3a XL GoogleAPI Emulator',
      platformName: 'Android',
      platformVersion: '10.0',
      deviceOrientation: 'portrait',
      ...SAUCE_CREDENTIALS,
    },
  },
  'Pixel 3 XL': {
    capabilities: {
      deviceName: 'Google Pixel 3 XL GoogleAPI Emulator',
      platformName: 'Android',
      platformVersion: '10.0',
      deviceOrientation: 'portrait',
      ...SAUCE_CREDENTIALS,
    },
    url: SAUCE_SERVER_URL,
    sauce: true,
  },
  'Samsung Galaxy S8': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      browserName: '',
      name: 'Android Demo',
      platformName: 'Android',
      platformVersion: '7.0',
      appiumVersion: '1.9.1',
      deviceName: 'Samsung Galaxy S8 FHD GoogleAPI Emulator',
      automationName: 'uiautomator2',
      newCommandTimeout: 600,
      ...SAUCE_CREDENTIALS,
    },
  },
  'iPhone 5S': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      deviceName: 'iPhone 5s Simulator',
      platformVersion: '12.4',
      platformName: 'iOS',
      ...SAUCE_CREDENTIALS,
    },
  },
  'iPhone 11 Pro': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      deviceName: 'iPhone 11 Pro Simulator',
      platformVersion: '13.4',
      platformName: 'iOS',
      ...SAUCE_CREDENTIALS,
    },
  },
  'iPhone XS': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      platformName: 'iOS',
      platformVersion: '13.0',
      deviceName: 'iPhone XS Simulator',
      ...SAUCE_CREDENTIALS,
    },
  },
  'iPad Air': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      deviceName: 'iPad Air Simulator',
      platformVersion: '12.4',
      platformName: 'iOS',
      ...SAUCE_CREDENTIALS,
    },
  },
  'Android 8.0 Chrome Emulator': {
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        mobileEmulation: {
          deviceMetrics: {width: 384, height: 512, pixelRatio: 2},
          userAgent:
            'Mozilla/5.0 (Linux; Android 8.0.0; Android SDK built for x86_64 Build/OSR1.180418.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
        },
        args: ['hide-scrollbars'],
      },
    },
  },
}

const BROWSERS = {
  'edge-18': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      browserName: 'MicrosoftEdge',
      browserVersion: '18.17763',
      platformName: 'Windows 10',
    },
    options: {
      name: 'Edge 18',
      avoidProxy: true,
      screenResolution: '1920x1080',
      ...SAUCE_CREDENTIALS,
    },
  },
  'ie-11': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      w3c: {
        browserName: 'internet explorer',
        browserVersion: '11.285',
        platformName: 'Windows 10',
      },
      legacy: {
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.285',
      },
    },
    options: {
      name: 'IE 11',
      screenResolution: '1920x1080',
      ...SAUCE_CREDENTIALS,
    },
  },
  'safari-11': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      w3c: {
        browserName: 'safari',
        browserVersion: '11.0',
        platformName: 'macOS 10.12',
      },
      legacy: {
        browserName: 'safari',
        version: '11.0',
        platform: 'macOS 10.12',
      },
    },
    options: {
      name: 'Safari 11',
      seleniumVersion: '3.4.0',
      ...SAUCE_CREDENTIALS,
    },
  },
  'safari-12': {
    type: 'sauce',
    url: SAUCE_SERVER_URL,
    capabilities: {
      w3c: {
        browserName: 'safari',
        browserVersion: '12.1',
        platformName: 'macOS 10.13',
      },
      legacy: {
        browserName: 'safari',
        version: '12.1',
        platform: 'macOS 10.13',
      },
    },
    options: {
      name: 'Safari 12',
      seleniumVersion: '3.4.0',
      ...SAUCE_CREDENTIALS,
    },
  },
  firefox: {
    url: 'http://localhost:4445/wd/hub',
    capabilities: {
      browserName: 'firefox',
    },
  },
  chrome: {
    capabilities: {
      browserName: 'chrome',
    },
  },
}

function Env(
  {browser, app, device, url, headless = !process.env.NO_HEADLESS, legacy, ...options} = {},
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
      env.capabilities = Object.assign(
        env.capabilities,
        (legacy ? preset.capabilities.legacy : preset.capabilities.w3c) || preset.capabilities,
      )
      env.configurable = preset.type !== 'sauce'
      if (preset.type === 'sauce') {
        if (legacy || env.device) {
          env.options = env.capabilities = {...env.capabilities, ...preset.options}
        } else {
          env.options = env.capabilities['sauce:options'] = {...preset.options}
        }
      } else {
        env.options = preset.options || {}
      }
      env.options.deviceOrientation = env.orientation
    }
  } else if (protocol === 'cdp') {
    url = url || process.env.CVG_TESTS_CDP_REMOTE
    env.url = url ? new URL(url) : undefined
  }
  return env
}

const batchName = process.env.APPLITOOLS_BATCH_NAME || 'JS Coverage Tests'
const batch = typeof BatchInfo === 'undefined' ? batchName : new BatchInfo(batchName)

function getEyes({vg, ...config} = {}) {
  const eyes = new Eyes(vg ? new VisualGridRunner(10) : undefined)
  const conf = {
    apiKey: process.env.APPLITOOLS_API_KEY_SDK,
    batch,
    parentBranchName: 'master',
    branchName: 'master',
    dontCloseBatches: true,
    matchTimeout: 0,
    saveNewTests: false,
    ...config,
  }
  eyes.setConfiguration(new Configuration(conf))

  // if (process.env.APPLITOOLS_SHOW_LOGS || showLogs) {
  //   eyes.setLogHandler(new ConsoleLogHandler(true))
  // }

  return eyes
}

module.exports = {
  Env,
  getEyes,
  batch,
  BROWSERS,
  DEVICES,
}
