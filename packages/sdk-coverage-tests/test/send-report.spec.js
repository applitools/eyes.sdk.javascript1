const assert = require('assert')
const {sendReport} = require('../src/send-report')

describe.skip('send-report', async () => {
  it('should send a payload and get a successful response from the report server', async () => {
    const result = await sendReport({
      sdk: 'js_selenium_4',
      group: 'selenium',
      sandbox: true,
      results: [
        {
          test_name: 'TestCheckRegion',
          parameters: {
            browser: 'chrome',
            mode: 'css',
          },
          passed: false,
        },
        {
          test_name: 'TestCheckRegion',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: false,
        },
        {
          test_name: 'TestCheckWindow',
          parameters: {
            browser: 'chrome',
            mode: 'visualgrid',
          },
          passed: true,
        },
      ],
    })
    assert.ok(result.isSuccessful)
  })
  it('should expose the error message if not successful', async () => {
    const result = await sendReport({})
    assert.ok(!result.isSuccessful)
    assert.ok(result.message === 'Bad Request')
  })
})
