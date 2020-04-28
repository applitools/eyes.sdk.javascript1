const assert = require('assert')
const {
  findUnsupportedTests,
  findUnimplementedCommands,
  filterTestsByName,
  filterTestsByMode,
  filterTestsByIndexes,
  getTestIndexesFromErrors,
  sortErrorsByType,
  getPassedTestIndexes,
} = require('../src/cli/cli-util')
const {makeCoverageTests} = require('../src/index')
const {supportedCommands} = require('../src/tests')

describe('cli-util', () => {
  describe('doRunTests', () => {
    it('filter tests by name', () => {
      assert.deepStrictEqual(filterTestsByName('a', [{name: 'a'}, {name: 'b'}]), [{name: 'a'}])
    })
    it('filter tests by name - exact match', () => {
      assert.deepStrictEqual(filterTestsByName('a', [{name: 'abc'}, {name: 'bbc'}]), [])
    })
    it('filter tests by name - glob wildcard', () => {
      assert.deepStrictEqual(filterTestsByName('a*', [{name: 'abc'}, {name: 'bbc'}]), [
        {name: 'abc'},
      ])
    })
    it('filter tests by mode', () => {
      assert.deepStrictEqual(
        filterTestsByMode('isBlah', [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ]),
        [{name: 'a', executionMode: {isBlah: true}}],
      )
    })
    it('filter tests by indexes', () => {
      assert.deepStrictEqual(filterTestsByIndexes('2,1', ['a', 'b', 'c']), ['c', 'b'])
    })
    it('full collection returned on undefined', () => {
      assert.deepStrictEqual(filterTestsByName(undefined, [{name: 'a'}, {name: 'b'}]), [
        {name: 'a'},
        {name: 'b'},
      ])
      assert.deepStrictEqual(
        filterTestsByMode(undefined, [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ]),
        [
          {name: 'a', executionMode: {isBlah: true}},
          {name: 'b', executionMode: {isHalb: true}},
        ],
      )
    })
  })
  describe('doHealthCheck', () => {
    it('finds unsupported tests', () => {
      const sdkImplementation = {
        supportedTests: [],
      }
      const totalNumberOfTests = Object.keys(makeCoverageTests()).length
      assert.deepStrictEqual(findUnsupportedTests(sdkImplementation).length, totalNumberOfTests)
    })
    it('finds unimplemented commands', () => {
      const sdkImplementation = {
        initialize: () => {},
      }
      const totalNumberOfCommands = supportedCommands.length
      assert.deepStrictEqual(
        findUnimplementedCommands(sdkImplementation).length,
        totalNumberOfCommands,
      )
    })
  })
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
