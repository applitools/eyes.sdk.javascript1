const {toXmlOutput} = require('../../lib/TestResultsFormatter')
const {TestResults} = require('../../lib/TestResults')
const {TestResultsStatus} = require('../../lib/TestResultsStatus')
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
<testsuite name="blah" tests="2" time="10">
<testcase name="someName1">
</testcase>
<testcase name="someName2">
</testcase>
</testsuite>`
      assert.deepStrictEqual(toXmlOutput({testResults, suiteName: 'blah', totalTime: 10}), expected)
    })
    it('works with 1 diff', () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatus.Passed,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResults({
          status: TestResultsStatus.Unresolved,
          isDifferent: true,
          name: 'My Component | Button1',
          hostApp: 'Firefox',
          hostDisplaySize: {width: 100, height: 200},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="blah" tests="2" time="10">
<testcase name="My Component | Button2">
</testcase>
<testcase name="My Component | Button1">
<failure>
Difference found. See https://eyes.com/results for details.
</failure>
</testcase>
</testsuite>`
      assert.deepStrictEqual(toXmlOutput({testResults, suiteName: 'blah', totalTime: 10}), expected)
    })
    it('works with multiple diffs', () => {
      const testResults = [
        new TestResults({
          status: TestResultsStatus.Unresolved,
          isDifferent: true,
          name: 'My Component | Button2',
          hostApp: 'Chrome',
          hostDisplaySize: {width: 10, height: 20},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
        new TestResults({
          status: TestResultsStatus.Unresolved,
          isDifferent: true,
          name: 'My Component | Button1',
          hostApp: 'Firefox',
          hostDisplaySize: {width: 100, height: 200},
          appUrls: {batch: 'https://eyes.com/results'},
        }),
      ]
      const expected = `<?xml version="1.0" encoding="UTF-8" ?>
<testsuite name="blah" tests="2" time="10">
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
      assert.deepStrictEqual(toXmlOutput({testResults, suiteName: 'blah', totalTime: 10}), expected)
    })
  })
})
