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
    './test/coverage/generic/*.spec.js',
    '../sdk-shared/coverage-tests/custom/**.spec.js',
  ],
  parallel: true,
  jobs: 15,
  timeout: 0,
  reporter: 'spec-xunit-file',
  require: './test/util/version-alias.js',
  grep: new RegExp(`^[\\w\\s]*?(\\((?:@(${tags.join('|')}) ?)+\\))?$`),
}
