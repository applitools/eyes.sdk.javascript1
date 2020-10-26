const assert = require('assert')
const {
  getTestIndexesFromErrors,
  sortErrorsByType,
  getPassedTestIndexes,
} = require('../src/cli-util')

describe('cli-util', () => {
  describe('doDisplayResults', () => {
    it('sorts errors by type', () => {
      const errors = [{name: 'halb'}, {name: 'zzz'}, {name: 'blah'}]
      const expected = [{name: 'blah'}, {name: 'halb'}, {name: 'zzz'}]
      assert.deepStrictEqual(sortErrorsByType(errors), expected)
    })
    it('should get test indexes from errors', () => {
      const errors = [{testIndex: 0}, {testIndex: 1}]
      assert.deepStrictEqual(getTestIndexesFromErrors(errors), [0, 1])
    })
    it('should not get test indexes from errors when none are present', () => {
      assert.deepStrictEqual(getTestIndexesFromErrors([{}]), undefined)
    })
    it('should get test indexes for passed tests', () => {
      const tests = {a: () => {}, b: () => {}, c: () => {}, d: () => {}}
      const errors = [{testIndex: 1}, {testIndex: 3}]
      assert.deepStrictEqual(getPassedTestIndexes({tests, errors}), [0, 2])
    })
  })
})
