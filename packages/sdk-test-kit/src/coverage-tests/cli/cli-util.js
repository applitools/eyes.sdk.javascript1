const {findDifferencesBetweenCollections} = require('../common-util')
const {makeCoverageTests} = require('../index')
const {supportedCommands} = require('../tests')
const {isMatch} = require('micromatch')

function findUnsupportedTests(sdkImplementation) {
  const allTests = makeCoverageTests()
  const sdkSupportedTests = sdkImplementation.supportedTests.map(test => test.name)
  return findDifferencesBetweenCollections(allTests, sdkSupportedTests)
}

function findUnimplementedCommands(sdkImplementation) {
  const allCommands = supportedCommands
  const sdkImplementedCommands = sdkImplementation.initialize()
  return findDifferencesBetweenCollections(allCommands, sdkImplementedCommands)
}

function filterTestsByName(filter, tests) {
  if (!filter) return tests
  return tests.filter(test => {
    return isMatch(test.name, filter)
  })
}

function filterTestsByMode(filter, tests) {
  if (!filter) return tests
  return tests.filter(test => {
    return test.executionMode.hasOwnProperty(filter)
  })
}

function filterTestsByIndexes(indexes, tests) {
  if (!indexes) return tests
  const _indexes =
    typeof indexes === 'string' ? indexes.split(',').map(id => Math.floor(id)) : indexes
  let _tests = []
  _indexes.forEach(id => {
    _tests.push(tests[id])
  })
  return _tests
}

function filterTests({tests, args}) {
  let result = tests
  result = filterTestsByName(args.filterName, result)
  result = filterTestsByMode(args.filterMode, result)
  result = filterTestsByIndexes(args.filterIndexes, result)
  return result
}

function numberOfUniqueTests(tests) {
  return [...new Set(tests.map(t => t.name))].length
}

function numberOfTestVariations(tests) {
  return tests.filter(t => !t.disabled).length
}

function sortErrorsByType(errors) {
  return errors.sort((a, b) => {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    if (nameA < nameB) return -1
    else if (nameA > nameB) return 1
    else return 0
  })
}

function getTestIndexesFromErrors(errors) {
  if (!errors) return undefined
  const indexes = errors
    .filter(error => error.hasOwnProperty('testIndex'))
    .map(entry => entry.testIndex)
  return indexes.length ? indexes : undefined
}

function getPassedTestIndexes({tests, errors}) {
  if (!tests || !errors) return undefined
  const errorIndexes = errors.map(e => e.testIndex)
  const testIndexes = Object.keys(tests).map((_test, index) => index)
  errorIndexes.forEach(errorIndex => {
    const result = testIndexes.find(testIndex => testIndex === errorIndex)
    const resultIndex = testIndexes.findIndex(testIndex => testIndex === result)
    testIndexes.splice(resultIndex, 1)
  })
  return testIndexes.length ? testIndexes : undefined
}

function needsChromeDriver(args, sdkImplementation) {
  return !args.remote && sdkImplementation.options && sdkImplementation.options.needsChromeDriver
}

module.exports = {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTests,
  filterTestsByName,
  filterTestsByMode,
  filterTestsByIndexes,
  getTestIndexesFromErrors,
  sortErrorsByType,
  getPassedTestIndexes,
  numberOfUniqueTests,
  numberOfTestVariations,
  needsChromeDriver,
}
