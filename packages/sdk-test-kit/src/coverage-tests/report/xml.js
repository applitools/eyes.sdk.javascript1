const convert = require('xml-js')
const {logDebug} = require('../log')

function convertJunitXmlToResultSchema({xmlResult, browser}) {
  let result = []
  const tests = parseJunitXmlForTests(xmlResult)
  logDebug(tests)
  tests.forEach(test => {
    const testName = parseBareTestName(test._attributes.classname)
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

function parseBareTestName(testCaseName) {
  return testCaseName.replace(/Coverage Tests /, '')
}

function parseExecutionMode(bareTestName) {
  const parsedBareTestName = bareTestName.split('_')
  const suffix =
    parsedBareTestName.length > 1 ? parsedBareTestName[parsedBareTestName.length - 1] : undefined
  return convertSuffixToExecutionMode(suffix)
}

function parseJunitXmlForTests(xmlResult) {
  const jsonResult = JSON.parse(convert.xml2json(xmlResult, {compact: true, spaces: 2}))
  if (jsonResult.hasOwnProperty('testsuites'))
    return jsonResult.testsuites.testsuite.map(suite => suite.testcase)
  else if (jsonResult.hasOwnProperty('testsuite')) {
    const testCase = jsonResult.testsuite.testcase
    return testCase.hasOwnProperty('_attributes') ? [testCase] : testCase
  } else throw new Error('Unsupported XML format provided')
}

module.exports = {
  convertJunitXmlToResultSchema,
  parseBareTestName,
  parseExecutionMode,
  parseJunitXmlForTests,
}
