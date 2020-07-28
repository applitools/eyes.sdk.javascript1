const {readFileSync} = require('fs')
const path = require('path')
const {
  createReport,
  convertJunitXmlToResultSchema,
  convertSdkNameToReportName,
} = require('../../src/report')
const {
  parseBareTestName,
  parseExecutionMode,
  parseJunitXmlForTests,
} = require('../../src/report/xml')
const assert = require('assert')

function loadFixture(fileName) {
  return readFileSync(path.resolve(path.join(__dirname, 'fixtures', fileName)), {encoding: 'utf-8'})
}

const xmlResult = loadFixture('multiple-suites-multiple-tests.xml')
const metaData = {
  TestCheckWindow: {
    isGeneric: true,
  },
  TestCheckWindow_VG: {
    isGeneric: true,
  },
  TestCheckWindow_Scroll: {
    isGeneric: true,
  },
}
describe('Report', () => {
  describe('JUnit XML Parser', () => {
    it('should throw if parsing an unsupported xml', () => {
      assert.throws(() => {
        parseJunitXmlForTests(`<?xml version="1.0" encoding="UTF-8"?>`)
      }, /Unsupported XML format provided/)
    })
    it('should support multiple suites with multiple tests', () => {
      const result = parseJunitXmlForTests(xmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
    it('should support multiple suites with multiple tests at every suite', () => {
      const altXmlResult = loadFixture('multiple-suites-multiple-tests-each.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
    it('should support multiple suites with one suite with multiple tests', () => {
      const altXmlResult = loadFixture('multiple-suites-multiple-tests-one.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
    it('should support multiple suites with a single test', () => {
      const altXmlResult = loadFixture('multiple-suites-single-test.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
    it('should support a single suite with a single test', () => {
      const altXmlResult = loadFixture('single-suite-single-test.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
    it('should support a single suite with multiple tests', () => {
      const altXmlResult = loadFixture('single-suite-multiple-tests.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(result[0].hasOwnProperty('_attributes'))
    })
  })
  it('should parse the bare test name', () => {
    assert.deepStrictEqual(parseBareTestName('Coverage Tests TestCheckWindow'), 'TestCheckWindow')
    assert.deepStrictEqual(
      parseBareTestName('Coverage Tests Test Check Window'),
      'Test Check Window',
    )
    assert.deepStrictEqual(
      parseBareTestName(
        'TestCheckWindow_Fluent (screenshots: /Users/tourdedave/_dev/applitools/eyes.sdk.javascript1/packages/eyes-testcafe/screenshots/.applitools-abe4123e-d970-44da-8c3c-220fb9b47640/screenshot.png)',
      ),
      'TestCheckWindow_Fluent',
    )
  })
  it('should return the report test name', () => {
    assert.deepStrictEqual(convertSdkNameToReportName('eyes-selenium'), 'js_selenium_4')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes-selenium-3'), 'js_selenium_3')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes.webdriverio.javascript5'), 'js_wdio_5')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes.webdriverio.javascript4'), 'js_wdio_4')
    assert.deepStrictEqual(convertSdkNameToReportName('eyes-images'), 'js_images')
  })
  it('should return the expected mode name', () => {
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow_VG'), 'visualgrid')
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow_Scroll'), 'scroll')
    assert.deepStrictEqual(parseExecutionMode('TestCheckWindow'), 'css')
  })
  it(`should omit skipped testcases`, () => {
    const altXmlResult = loadFixture('single-suite-skipped-test.xml')
    const result = convertJunitXmlToResultSchema({xmlResult: altXmlResult})
    assert.deepStrictEqual(result.length, 0)
  })
  it(`should omit skipped testcases with multiple testcases`, () => {
    const altXmlResult = loadFixture('single-suite-multiple-tests-with-skipped.xml')
    const result = convertJunitXmlToResultSchema({xmlResult: altXmlResult, metaData: {}})
    assert.deepStrictEqual(result.length, 3)
  })
  it('should convert xml report to QA report schema as JSON', () => {
    assert.deepStrictEqual(convertJunitXmlToResultSchema({xmlResult, metaData: {}}), [
      {
        test_name: 'TestCheckWindow',
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
        test_name: 'TestCheckWindow',
        parameters: {
          browser: 'chrome',
          mode: 'scroll',
        },
        passed: true,
      },
    ])
  })
  it('should convert xml report to QA report schema as JSON with generic set to false', () => {
    assert.deepStrictEqual(convertJunitXmlToResultSchema({metaData: {}, xmlResult}), [
      {
        test_name: 'TestCheckWindow',
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
        test_name: 'TestCheckWindow',
        parameters: {
          browser: 'chrome',
          mode: 'scroll',
        },
        passed: true,
      },
    ])
  })

  it('should create a report payload without id', () => {
    assert.deepStrictEqual(
      createReport({sdkName: 'eyes-selenium', metaData: metaData, xmlResult}),
      {
        sdk: 'js_selenium_4',
        group: 'selenium',
        sandbox: true,
        results: [
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'visualgrid',
            },
            passed: false,
          },
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'css',
            },
            passed: true,
          },
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'scroll',
            },
            passed: true,
          },
        ],
        id: undefined,
      },
    )
  })

  it('should create a report payload with id', () => {
    assert.deepStrictEqual(
      createReport({sdkName: 'eyes-selenium', id: '111111', metaData: metaData, xmlResult}),
      {
        sdk: 'js_selenium_4',
        group: 'selenium',
        sandbox: true,
        results: [
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'visualgrid',
            },
            passed: false,
          },
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'css',
            },
            passed: true,
          },
          {
            test_name: 'TestCheckWindow',
            isGeneric: true,
            parameters: {
              browser: 'chrome',
              mode: 'scroll',
            },
            passed: true,
          },
        ],
        id: '111111',
      },
    )
  })
})
