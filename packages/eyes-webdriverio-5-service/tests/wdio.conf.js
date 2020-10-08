const path = require('path')
const {EyesService} = require('@applitools/eyes-webdriverio')

exports.config = {
  runner: 'local',
  specs: [path.join(__dirname, '*.spec.js')],
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['headless'],
      },
    },
  ],
  logLevel: 'error',
  services: [[EyesService]],
  port: 4444,
  path: '/wd/hub',
  framework: 'mocha',
  reporters: ['dot'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },
}
