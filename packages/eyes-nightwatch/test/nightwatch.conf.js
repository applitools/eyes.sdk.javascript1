// Refer to the online docs for more details: https://nightwatchjs.org/gettingstarted/configuration/
const Services = {}
loadServices()

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: [],

  // See https://nightwatchjs.org/guide/working-with-page-objects/
  page_objects_path: '',

  // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
  custom_commands_path: '',

  // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions
  custom_assertions_path: '',

  // See https://nightwatchjs.org/guide/#external-globals
  globals_path: '',

  webdriver: {},

  test_settings: {
    default: {
      disable_error_log: false,

      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true,
      },

      // JSON Wire Protocol (JWP) -- a.k.a. w3c: false (implicit in Chrome)
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless'],
          w3c: false,
        },
      },
      // W3C
      //capabilities: {
      //  browserName: 'chrome',
      //  'goog:chromeOptions': {
      //    w3c: true,
      //    args: ['--headless'],
      //  },
      //},

      webdriver: {
        port: 4444,
        default_path_prefix: '/wd/hub',
      },
    },

    //safari: {
    //  desiredCapabilities: {
    //    browserName: 'safari',
    //    alwaysMatch: {
    //      acceptInsecureCerts: false,
    //    },
    //  },
    //  webdriver: {
    //    port: 4445,
    //    start_process: true,
    //    server_path: '/usr/bin/safaridriver',
    //  },
    //},

    // NOTE: doesn't work - I think it's a bug in capability merging that was fixed in a later version
    chrome: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: ['--headless'],
        },
      },

      webdriver: {
        start_process: true,
        port: 9515,
        server_path: Services.chromedriver ? Services.chromedriver.path : '',
        cli_args: [
          // --verbose
        ],
      },
    },

    // implicitly w3c: true
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
              //'-headless',
              // '-verbose'
            ],
          },
        },
      },
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: Services.geckodriver ? Services.geckodriver.path : '',
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ],
      },
    },
    'firefox.headless': {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          // Enable this if you encounter unexpected SSL certificate errors in Firefox
          // acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
              '-headless',
              // '-verbose'
            ],
          },
        },
      },
      webdriver: {
        start_process: true,
        port: 4444,
        server_path: Services.geckodriver ? Services.geckodriver.path : '',
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ],
      },
    },

    'chrome.headless': {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          // This tells Chromedriver to run using the legacy JSONWire protocol
          // w3c: false
          // set to false implicitly
          args: ['--headless'],
        },
      },

      webdriver: {
        start_process: true,
        port: 9515,
        server_path: Services.chromedriver ? Services.chromedriver.path : '',
        cli_args: [
          // --verbose
        ],
      },
    },

    //////////////////////////////////////////////////////////////////////////////////
    // Configuration for when using the browserstack.com cloud service               |
    //                                                                               |
    // Please set the username and access key by setting the environment variables:  |
    // - BROWSERSTACK_USER                                                           |
    // - BROWSERSTACK_KEY                                                            |
    // .env files are supported                                                      |
    //////////////////////////////////////////////////////////////////////////////////
    browserstack: {
      selenium: {
        host: 'hub-cloud.browserstack.com',
        port: 443,
      },
      // More info on configuring capabilities can be found on:
      // https://www.browserstack.com/automate/capabilities?tag=selenium-4
      desiredCapabilities: {
        'bstack:options': {
          local: 'false',
        },
      },

      disable_error_log: true,
      webdriver: {
        port: 443,
        keep_alive: true,
        start_process: false,
      },
    },

    //'browserstack.chrome': {
    //  extends: 'browserstack',
    //  desiredCapabilities: {
    //    browserName: 'chrome',
    //    chromeOptions: {
    //      // This tells Chromedriver to run using the legacy JSONWire protocol
    //      // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
    //      w3c: false,
    //    },
    //  },
    //},

    //'browserstack.firefox': {
    //  extends: 'browserstack',
    //  desiredCapabilities: {
    //    browserName: 'firefox',
    //  },
    //},

    //'browserstack.ie': {
    //  extends: 'browserstack',
    //  desiredCapabilities: {
    //    browserName: 'IE',
    //    browserVersion: '11.0',
    //    'bstack:options': {
    //      os: 'Windows',
    //      osVersion: '10',
    //      local: 'false',
    //      seleniumVersion: '3.5.2',
    //      resolution: '1366x768',
    //    },
    //  },
    //},

    'browserstack.android': {
      extends: 'browserstack',
      desiredCapabilities: {
        app: 'app_android',
        automationName: 'UiAutomator2',
        platformName: 'Android',
        osVersion: '9.0',
        device: 'google pixel 2',
        browserstack: {
          appiumVersion: '1.17.0',
        },
      },
    },

    //////////////////////////////////////////////////////////////////////////////////
    // Configuration for when using the Selenium service, either locally or remote,  |
    //  like Selenium Grid                                                           |
    //////////////////////////////////////////////////////////////////////////////////
    //selenium: {
    //  // Selenium Server is running locally and is managed by Nightwatch
    //  selenium: {
    //    start_process: true,
    //    port: 4444,
    //    server_path: Services.seleniumServer ? Services.seleniumServer.path : '',
    //    cli_args: {
    //      'webdriver.gecko.driver': Services.geckodriver ? Services.geckodriver.path : '',
    //      'webdriver.chrome.driver': Services.chromedriver ? Services.chromedriver.path : '',
    //    },
    //  },
    //},

    //'selenium.chrome': {
    //  extends: 'selenium',
    //  desiredCapabilities: {
    //    browserName: 'chrome',
    //    chromeOptions: {
    //      w3c: false,
    //    },
    //  },
    //},

    //'selenium.firefox': {
    //  extends: 'selenium',
    //  desiredCapabilities: {
    //    browserName: 'firefox',
    //    'moz:firefoxOptions': {
    //      args: [
    //        // '-headless',
    //        // '-verbose'
    //      ],
    //    },
    //  },
    //},
  },
}

function loadServices() {
  process.env.BROWSERSTACK_USER = process.env.BROWSERSTACK_USERNAME
  process.env.BROWSERSTACK_KEY = process.env.BROWSERSTACK_ACCESS_KEY
  //try {
  //  Services.seleniumServer = require('selenium-server')
  //} catch (err) {}

  try {
    Services.chromedriver = require('chromedriver')
  } catch (err) {}

  try {
    Services.geckodriver = require('geckodriver')
  } catch (err) {}
}
