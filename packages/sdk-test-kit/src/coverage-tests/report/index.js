const {convertJunitXmlToResultSchema, parseBareTestName, parseExecutionMode} = require('./xml')

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

function createReport({sdkName, xmlResult, browser, group, sandbox} = {}) {
  return {
    sdk: convertSdkNameToReportName(sdkName),
    group: group ? group : 'selenium',
    sandbox: sandbox ? sandbox : true,
    results: convertJunitXmlToResultSchema({xmlResult, browser}),
  }
}

module.exports = {
  createReport,
  convertJunitXmlToResultSchema,
  convertSdkNameToReportName,
  parseBareTestName,
  parseExecutionMode,
}
