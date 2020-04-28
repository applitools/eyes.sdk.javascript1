const assert = require('assert')
const {makeCoverageTests} = require('../src/index')

const fakeSDK = {
  visit: () => {},
  open: () => {},
  checkFrame: () => {},
  checkRegion: () => {},
  checkWindow: () => {},
  close: () => {},
  cleanup: () => {},
}

describe('coverage-tests', () => {
  describe('makeCoverageTests', () => {
    it('should return a collection of tests for an implemented SDK', () => {
      const tests = makeCoverageTests(fakeSDK)
      assert.ok(Object.keys(tests).length)
    })
  })
})
