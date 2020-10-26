const {convertJunitXmlToResultSchema} = require('./xml')

function createReport({reportId, name, group, junit, metadata, sandbox = true}) {
  return {
    id: reportId,
    sdk: convertSdkNameToReportName(name),
    group: group ? group : 'selenium',
    results: convertJunitXmlToResultSchema({junit, metadata}),
    sandbox,
  }
}

function convertSdkNameToReportName(sdkName) {
  switch (sdkName) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes-selenium-3':
      return 'js_selenium_3'
    case 'eyes.webdriverio.javascript5':
      return 'js_wdio_5'
    case 'eyes.webdriverio.javascript4':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    case 'eyes-testcafe':
      return 'testcafe'
    case 'eyes-protractor':
      return 'js_protractor'
    case 'eyes_selenium_python':
      return 'python'
    case 'eyes_selenium_ruby':
      return 'ruby'
    case 'eyes_selenium_java':
      return 'java'
    case 'eyes_selenium_dotnet':
      return 'dotnet'
    case 'playwright':
      return 'playwright'
    default:
      throw new Error('Unsupported SDK')
  }
}

module.exports = {createReport, convertSdkNameToReportName}
