const {EyesService} = require('../..')
const {testSetup} = require('@applitools/sdk-shared')

exports.config = {
  runner: 'local',
  capabilities: [testSetup.Env({browser: 'chrome'}).capabilities],
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
