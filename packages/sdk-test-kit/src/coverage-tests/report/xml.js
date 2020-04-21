const convert = require('xml-js')

function convertJunitXmlToResultSchema({xmlResult, browser}) {
  let result = []
  const tests = parseJunitXmlForTests(xmlResult)
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
  const parsedTestCaseName = testCaseName.split(' ')
  return parsedTestCaseName[parsedTestCaseName.length - 1]
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
    return [jsonResult.testsuite.testcase]
  } else throw new Error('Unsupported XML format provided')
}

module.exports = {
  convertJunitXmlToResultSchema,
  parseBareTestName,
  parseExecutionMode,
  parseJunitXmlForTests,
}
