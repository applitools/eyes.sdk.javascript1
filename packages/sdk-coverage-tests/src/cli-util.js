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
  getTestIndexesFromErrors,
  sortErrorsByType,
  getPassedTestIndexes,
  needsChromeDriver,
}
