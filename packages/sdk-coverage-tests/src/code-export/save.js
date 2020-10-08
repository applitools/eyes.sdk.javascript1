const fs = require('fs')
const path = require('path')

async function createTestFiles(emittedTests, sdkImplementation) {
  const targetDirectory = path.join(process.cwd(), sdkImplementation.out)

  fs.rmdirSync(targetDirectory, {recursive: true})
  fs.mkdirSync(targetDirectory, {recursive: true})

  emittedTests.forEach(test => {
    const payload = sdkImplementation.testFrameworkTemplate(test)
    const filePath = path.resolve(targetDirectory, `${test.name}${sdkImplementation.ext}`)
    fs.writeFileSync(filePath, payload)
  })
}
async function createTestMetaData(emittedTests, sdkImplementation) {
  const metaData = {}
  emittedTests.forEach(test => (metaData[test.name] = {isGeneric: true}))
  const dirPath = path.resolve(process.cwd(), sdkImplementation.metaPath || '')
  const filePath = path.resolve(dirPath, 'coverage-tests-metadata.json')
  fs.mkdirSync(dirPath, {recursive: true})
  fs.writeFileSync(filePath, JSON.stringify(metaData, null, '\t'))
}

module.exports = {
  createTestFiles,
  createTestMetaData,
}
