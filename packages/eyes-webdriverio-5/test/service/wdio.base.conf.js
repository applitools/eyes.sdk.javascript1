const {EyesService} = require('../..')
const {
  TestSetup: {Browsers},
} = require('@applitools/sdk-coverage-tests/coverage-tests')

exports.config = {
  runner: 'local',
  capabilities: [Browsers.chrome()],
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
