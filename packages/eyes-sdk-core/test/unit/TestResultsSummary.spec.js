'use strict'

const assert = require('assert')

const {TestResultsSummary, TestResults, TestResultContainer} = require('../../index')

describe('TestResultsSummary', function() {
  it('iterator', async function() {
    const testResult1 = new TestResults({id: 'fake_01'})
    const testResult2 = new TestResults({id: 'fake_02'})
    const testResult3 = new TestResults({id: 'fake_03'})
    const testResult4 = new TestResults({id: 'fake_04'})
    const testResult5 = new TestResults({id: 'fake_05'})

    const testResults = new TestResultsSummary([
      testResult1,
      testResult2,
      testResult3,
      testResult4,
      testResult5,
    ])

    let counter = 0
    for (const testResult of testResults) {
      assert.ok(testResult instanceof TestResultContainer)
      counter += 1
    }
    assert.strictEqual(counter, 5)
  })
})
