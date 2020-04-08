const fs = require('fs')
const path = require('path')
const {createTestFileString} = require('./render')

function createTestFiles(emittedTests, testFrameworkTemplate) {
  const targetDirectory = path.join(process.cwd(), 'test', 'coverage', 'generic')
  fs.rmdirSync(targetDirectory, {recursive: true})
  fs.mkdirSync(targetDirectory)
  emittedTests.forEach(test => {
    const payload = createTestFileString(test, testFrameworkTemplate)
    const filePath = path.resolve(targetDirectory, `${test.name}.spec.js`)
    fs.writeFileSync(filePath, payload)
  })
}

module.exports = {
  createTestFiles,
}
