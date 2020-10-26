const tags = {
  wd: [
    'webdriver',
    'mobile',
    'native',
    'native-selectors',
    'chrome',
    'firefox',
    'ie',
    'edge',
    'safari',
  ],
  cdp: ['chrome']
}
const protocol = process.env.APPLITOOLS_WDIO_PROTOCOL in tags ? process.env.APPLITOOLS_WDIO_PROTOCOL : 'wd'
module.exports = {
  spec: [
    './test/generic/*.spec.js',
    '../sdk-shared/coverage-tests/custom/**/*.spec.js',
  ],
  parallel: true,
  jobs: 15,
  timeout: 0,
  reporter: 'spec-xunit-file',
  require: ['../sdk-shared/coverage-tests/util/mocha-hooks.js'],
  grep: new RegExp(`^[\\w\\s]*?(\\((?:@(${tags[protocol].join('|')}) ?)+\\))?$`),
}
