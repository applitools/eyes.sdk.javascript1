const tags = [
  'webdriver',
  'mobile',
  'native',
  'chrome',
  'firefox',
  'ie',
  'edge',
  'safari',
]
module.exports = {
  spec: [
    './test/generic/*.spec.js',
    '../sdk-shared/coverage-tests/custom/**/*.spec.js',
  ],
  parallel: true,
  jobs: 5,
  timeout: 0,
  reporter: 'spec-xunit-file',
  require: ['./test/util/version-alias.js', '../sdk-shared/coverage-tests/util/mocha-hooks.js'],
  grep: new RegExp(`^[\\w\\s]*?(\\((?:@(${tags.join('|')}) ?)+\\))?$`),
}
