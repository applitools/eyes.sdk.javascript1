const convert = require('xml-js')

function convertJunitXmlToResultSchema({xmlResult, browser}) {
  let result = []
  const jsonResult = JSON.parse(convert.xml2json(xmlResult, {compact: true, spaces: 2}))
  const tests = jsonResult.testsuites.testsuite.map(suite => suite.testcase)
  tests.forEach(test => {
    const testName = parseBareTestName(test._attributes.name)
    result.push({
      test_name: testName,
      parameters: {
        browser: browser ? browser : 'chrome',
        mode: parseExecutionMode(testName),
      },
      passed: !test.failure,
    })
  })
  return result
}

function parseBareTestName(testCaseName) {
  const parsedTestCaseName = testCaseName.split(' ')
  return parsedTestCaseName[parsedTestCaseName.length - 1]
}

function convertSuffixToExecutionMode(suffix) {
  switch (suffix) {
    case 'VG':
      return 'visualgrid'
    case 'Scroll':
      return 'scroll'
    default:
      return 'css'
  }
}

function parseExecutionMode(bareTestName) {
  const parsedBareTestName = bareTestName.split('_')
  const suffix =
    parsedBareTestName.length > 1 ? parsedBareTestName[parsedBareTestName.length - 1] : undefined
  return convertSuffixToExecutionMode(suffix)
}

module.exports = {
  convertJunitXmlToResultSchema,
  parseBareTestName,
  parseExecutionMode,
}
