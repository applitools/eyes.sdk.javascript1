const TestResultsFormatter = require('../../lib/TestResultsFormatter')
const TestResults = require('../../lib/TestResults')
const TestResultsError = require('../../lib/TestResultsError')
const TestResultsStatuses = require('../../lib/TestResultsStatus')
const assert = require('assert')

describe('TestResultsFormatter', () => {
  describe('XUnit XML', () => {
    it('works', () => {
      const testResults = [
        new TestResults({
          name: 'someName1',
          appName: 'My Component | Button1',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResults({
          name: 'someName2',
          appName: 'My Component | Button2',
          hostDisplaySize: {width: 100, height: 200},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="2" time="10">
<testcase name="someName1">
</testcase>
<testcase name="someName2">
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with 1 diff', () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Passed,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResults({
          status: TestResultsStatuses.Unresolved,
          isDifferent: true,
          name: 'My Component | Button1',
          hostApp: 'Firefox',
          hostDisplaySize: {width: 100, height: 200},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="2" time="10">
<testcase name="My Component | Button2">
</testcase>
<testcase name="My Component | Button1">
<failure>
Difference found. See https://eyes.com/results for details.
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with multiple diffs', () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Unresolved,
          isDifferent: true,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResults({
          status: TestResultsStatuses.Unresolved,
          isDifferent: true,
          name: 'My Component | Button1',
          hostApp: 'Firefox',
          hostDisplaySize: {width: 100, height: 200},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="2" time="10">
<testcase name="My Component | Button2">
<failure>
Difference found. See https://eyes.com/results for details.
</failure>
</testcase>
<testcase name="My Component | Button1">
<failure>
Difference found. See https://eyes.com/results for details.
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with 1 error', async () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Passed,
          isDifferent: false,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResultsError({
          name: 'My Component | Button1',
          error: new Error('some error message'),
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="2" time="10">
<testcase name="My Component | Button2">
</testcase>
<testcase name="My Component | Button1">
<failure>
some error message
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with multiple errors', async () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Passed,
          isDifferent: false,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResultsError({
          name: 'My Component | Button2',
          error: new Error('another error message'),
        }),
        new TestResultsError({
          name: 'My Component | Button1',
          error: new Error('some error message'),
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="3" time="10">
<testcase name="My Component | Button2">
</testcase>
<testcase name="My Component | Button2">
<failure>
another error message
</failure>
</testcase>
<testcase name="My Component | Button1">
<failure>
some error message
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with diffs and errors', async () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Unresolved,
          isDifferent: true,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResultsError({
          name: 'My Component | Button1',
          error: new Error('some error message'),
        }),
        new TestResultsError({
          name: 'My Component | Button3',
          error: new Error('some error message'),
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="3" time="10">
<testcase name="My Component | Button2">
<failure>
Difference found. See https://eyes.com/results for details.
</failure>
</testcase>
<testcase name="My Component | Button1">
<failure>
some error message
</failure>
</testcase>
<testcase name="My Component | Button3">
<failure>
some error message
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with no diifs and no errors', async () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Passed,
          isDifferent: false,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="1" time="10">
<testcase name="My Component | Button2">
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 10}), expected)
    })
    it('works with no diffs no errors and no succeeses', async () => {
      const testResults = []
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="0" time="0">
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 0}), expected)
    })
    it('works with no diffs no errors and no succeeses', async () => {
      const testResults = []
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="0" time="0">
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 0}), expected)
    })
    it('displays duration if provided', async () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatuses.Passed,
          isDifferent: false,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
          duration: 10,
        }),
        new TestResultsError({
          name: 'My Component | Button1',
          error: new Error('some error message'),
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="Eyes Test Suite" tests="2" time="20">
<testcase name="My Component | Button2" time="10">
</testcase>
<testcase name="My Component | Button1">
<failure>
some error message
</failure>
</testcase>
</testsuite>`
      const formatter = new TestResultsFormatter()
      testResults.forEach(r => formatter.addTestResults(r))
      assert.deepStrictEqual(formatter.toXmlOutput({totalTime: 20}), expected)
    })
  })
})
