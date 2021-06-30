// Refer to the online docs for more details: https://nightwatchjs.org/gettingstarted/configuration/
process.env.BROWSERSTACK_USER = process.env.BROWSERSTACK_USERNAME
process.env.BROWSERSTACK_KEY = process.env.BROWSERSTACK_ACCESS_KEY

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: [],

  // See https://nightwatchjs.org/guide/working-with-page-objects/
  page_objects_path: '',

  // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
  custom_commands_path: './commands',

  // See https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-assertions
  custom_assertions_path: '',

  // See https://nightwatchjs.org/guide/#external-globals
  globals_path: '',

  eyes: {
    // useVisualGrid: true,
    // concurrency: 2,
    enableEyesLogs: false,
    appName: 'eyes-nightwatch',
    testName: 'hello world',
    viewportSize: {width: 800, height: 600},
  },

  test_settings: {
    default: {
      // <parallel>
      live_output: true,
      test_workers: {enabled: true, workers: 'auto'},
      // </ parallel>
      disable_error_log: false,

      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true,
      },

      // JSON Wire Protocol (JWP)
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless'],
          w3c: false,
        },
      },

      webdriver: {
        port: 4444,
        default_path_prefix: '/wd/hub',
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          'moz:firefoxOptions': {
            args: [
              //'--headless'
            ],
          },
        },
      },
      webdriver: {
        port: 4445,
        default_path_prefix: '/wd/hub',
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
  },
}
