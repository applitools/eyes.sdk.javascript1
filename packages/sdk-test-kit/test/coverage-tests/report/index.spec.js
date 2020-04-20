const {
  createReport,
  convertJunitXmlToResultSchema,
  convertSdkNameToReportName,
  parseBareTestName,
  parseExecutionMode,
} = require('../../../src/coverage-tests/report')
const assert = require('assert')

const xmlResult = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="jest tests" tests="3" failures="1" time="40.117">
  <testsuite name="Coverage Tests" errors="0" failures="1" skipped="0" timestamp="2020-04-13T16:50:42" time="31.828" tests="1">
    <testcase classname="Coverage Tests TestCheckWindow_VG" name="Coverage Tests TestCheckWindow_VG" time="27.808">
      <failure>DiffsFoundError: Test &apos;TestCheckWindow_VG&apos; of &apos;Eyes Selenium SDK - Classic API&apos; detected differences!. See details at: https://eyes.applitools.com/app/batches/00000251815504138512/00000251815504137477?accountId=xIpd7EWjhU6cjJzDGrMcUw~~
    at EyesWrapper.close (/Users/tourdedave/_dev/applitools/eyes.sdk.javascript1/packages/visual-grid-client/node_modules/@applitools/eyes-sdk-core/lib/EyesBase.js:1201:19)
    at processTicksAndRejections (internal/process/task_queues.js:94:5)
    at /Users/tourdedave/_dev/applitools/eyes.sdk.javascript1/packages/visual-grid-client/src/sdk/makeClose.js:50:41
    at async Promise.all (index 0)
    at Object.&lt;anonymous&gt; (/Users/tourdedave/_dev/applitools/eyes.sdk.javascript1/packages/eyes-selenium/test/coverage/generic/TestCheckWindow_VG.spec.js:46:5)</failure>
    </testcase>
  </testsuite>
  <testsuite name="Coverage Tests" errors="0" failures="0" skipped="0" timestamp="2020-04-13T16:50:42" time="38.052" tests="1">
    <testcase classname="Coverage Tests TestCheckWindow" name="Coverage Tests TestCheckWindow" time="34.05">
    </testcase>
  </testsuite>
  <testsuite name="Coverage Tests" errors="0" failures="0" skipped="0" timestamp="2020-04-13T16:50:42" time="39.486" tests="1">
    <testcase classname="Coverage Tests TestCheckWindow_Scroll" name="Coverage Tests TestCheckWindow_Scroll" time="35.484">
    </testcase>
  </testsuite>
</testsuites>`

describe('Report', () => {
  it('should parse the bare test name', () => {
    assert.deepStrictEqual(parseBareTestName('Coverage Tests TestCheckWindow'), 'TestCheckWindow')
  })
  it('should return the report test name', () => {
    assert.deepStrictEqual(convertSdkNameToReportName('eyes-selenium'), 'js_selenium_4')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes.selenium'), 'js_selenium_3')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes.webdriverio.javascript5'), 'js_wdio_5')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes.webdriverio.javascript4'), 'js_wdio_4')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes-images'), 'js_images')
  })
  it('should return the expected mode name', () => {
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow_VG'), 'visualgrid')
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow_Scroll'), 'scroll')
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow'), 'css')
  })
  it('should convert xml report to QA report schema as JSON', () => {
    assert.deepStrictEqual(convertJunitXmlToResultSchema({xmlResult}), [
      {
        test_name: 'TestCheckWindow_VG',
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
          mode: 'css',
        },
        passed: true,
      },
      {
        test_name: 'TestCheckWindow_Scroll',
        parameters: {
          browser: 'chrome',
          mode: 'scroll',
        },
        passed: true,
      },
    ])
  })
  it('should create a report payload', () => {
    assert.deepStrictEqual(createReport({sdkName: 'eyes-selenium', xmlResult}), {
      sdk: 'js_selenium_4',
      group: 'selenium',
      sandbox: true,
      results: [
        {
          test_name: 'TestCheckWindow_VG',
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
            mode: 'css',
          },
          passed: true,
        },
        {
          test_name: 'TestCheckWindow_Scroll',
          parameters: {
            browser: 'chrome',
            mode: 'scroll',
          },
          passed: true,
        },
      ],
    })
  })
})
