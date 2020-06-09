const fetch = require('node-fetch')

async function _send({uri, payload}) {
  const result = await fetch(uri, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  })
  return {isSuccessful: result.status === 200, status: result.status, message: result.statusText}
}

async function sendReport(payload) {
  return _send({uri: 'http://sdk-test-results.herokuapp.com/result', payload})
}

async function sendNotification(payload) {
  return _send({uri: 'http://sdk-test-results.herokuapp.com/send_mail/sdks', payload})
}

function convertSdkNameToReportName(sdkName) {
  const name = sdkName.includes('@applitools') ? sdkName.split('/')[1] : sdkName
  switch (name) {
    case 'eyes-selenium':
      return 'js_selenium_4'
    case 'eyes.selenium':
      return 'js_selenium_3'
    case 'eyes-webdriverio':
      return 'js_wdio_5'
    case 'eyes.webdriverio':
      return 'js_wdio_4'
    case 'eyes-images':
      return 'js_images'
    case 'eyes-protractor':
      return 'js_protractor'
    default:
      throw new Error('Unsupported SDK')
  }
}

module.exports = {convertSdkNameToReportName, sendReport, sendNotification}
