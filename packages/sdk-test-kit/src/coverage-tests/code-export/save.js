const {writeFileSync} = require('fs')
const path = require('path')
const {createTestFileString} = require('./render')

function createTestFiles(emittedTests, testFrameworkTemplate) {
  const targetDirectory = path.join(process.cwd, 'test', 'coverage')
  emittedTests.forEach(test => {
    const payload = createTestFileString(test, testFrameworkTemplate)
    writeFileSync(path.resolve(targetDirectory, `${test.name}.spec.js`), payload)
  })
}

module.exports = {
  createTestFiles,
}
