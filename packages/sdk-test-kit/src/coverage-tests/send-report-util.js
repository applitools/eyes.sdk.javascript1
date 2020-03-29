const {getNameFromObject} = require('./common-util')

function convertExecutionModeToBareName(executionMode) {
  return getNameFromObject(executionMode)
    .replace(/^is/, '')
    .replace(/stitching$/i, '')
    .toLowerCase()
}

function convertSdkNameToReportName(sdkName) {
  switch (sdkName) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    default:
      throw new Error('Unsupported SDK')
  }
}

function hasPassed(errors, testName, executionMode) {
  return !errors.find(error => {
    return (
      error.testName === testName &&
      getNameFromObject(error.executionMode) === getNameFromObject(executionMode)
    )
  })
}

function makeSendReport({
  browser = 'chrome',
  errors,
  group = 'selenium',
  sdkName,
  testsRan,
  sandbox = true,
} = {}) {
  return {
    sdk: convertSdkNameToReportName(sdkName),
    group,
    sandbox,
    results: testsRan.map(test => {
      return {
        test_name: test.name,
        parameters: {
          browser,
          mode: convertExecutionModeToBareName(test.executionMode),
        },
        passed: hasPassed(errors, test.name, test.executionMode),
      }
    }),
  }
}

module.exports = {
  makeSendReport,
  hasPassed,
  makeSendReport,
}
