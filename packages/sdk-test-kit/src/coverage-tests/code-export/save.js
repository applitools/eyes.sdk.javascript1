const {writeFileSync} = require('fs')
const path = require('path')
const {createTestFileString} = require('./render')

function createTestFiles(emittedTests, testFrameworkTemplate) {
  const targetDirectory = path.join(process.cwd(), 'test', 'coverage', 'generic')
  emittedTests.forEach(test => {
    const payload = createTestFileString(test, testFrameworkTemplate)
    const filePath = path.resolve(targetDirectory, `${test.name}.spec.js`)
    writeFileSync(filePath, payload)
  })
}

module.exports = {
  createTestFiles,
}
