const {readFileSync} = require('fs')
const path = require('path')
const {
  createReport,
  convertJunitXmlToResultSchema,
  convertSdkNameToReportName,
} = require('../../../src/coverage-tests/report')
const {
  parseBareTestName,
  parseExecutionMode,
  parseJunitXmlForTests,
} = require('../../../src/coverage-tests/report/xml')
const assert = require('assert')

function loadFixture(fileName) {
  return readFileSync(path.resolve(path.join(__dirname, 'fixtures', fileName)), {encoding: 'utf-8'})
}

const xmlResult = loadFixture('multiple-suites-multiple-tests.xml')

describe('Report', () => {
  describe('JUnit XML Parser', () => {
    it('should throw if parsing an unsupported xml', () => {
      assert.throws(() => {
        parseJunitXmlForTests(`<?xml version="1.0" encoding="UTF-8"?>`)
      }, /Unsupported XML format provided/)
    })
    it('should support multiple test suites with multiple tests', () => {
      const result = parseJunitXmlForTests(xmlResult)
      assert(Array.isArray(result))
      assert(result.length)
      assert(typeof result[0] === 'object')
    })
    it('should support a single test suite with a single test', () => {
      const altXmlResult = loadFixture('single-suite-single-test.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(Array.isArray(result))
      assert(result.length)
      assert(typeof result[0] === 'object')
    })
    it('should support a single test suite with multiple tests', () => {
      const altXmlResult = loadFixture('single-suite-multiple-tests.xml')
      const result = parseJunitXmlForTests(altXmlResult)
      assert(Array.isArray(result))
      assert(result.length)
      assert(typeof result[0] === 'object')
    })
  })
  it('should parse the bare test name', () => {
    assert.deepStrictEqual(parseBareTestName('Coverage Tests TestCheckWindow'), 'TestCheckWindow')
    assert.deepStrictEqual(
      parseBareTestName('Coverage Tests Test Check Window'),
      'Test Check Window',
    )
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
