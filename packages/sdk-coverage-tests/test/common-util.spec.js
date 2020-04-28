const {findDifferencesBetweenCollections} = require('../src/common-util')
const assert = require('assert')

describe('common-util', () => {
  describe('findDifferencesBetweenCollections', () => {
    it('should support arrays', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], [0, 1, 2]), ['a'])
    })
    it('should support objects (keys)', () => {
      assert.deepStrictEqual(
        findDifferencesBetweenCollections({a: 0, b: 1, c: 2, d: 'a'}, {a: 0, b: 1, c: 2}),
        ['d'],
      )
    })
    it('should support mixing arrays and objects', () => {
      assert.deepStrictEqual(
        findDifferencesBetweenCollections(['a', 'b', 'c', 'd'], {a: 0, b: 0, c: 0}),
        ['d'],
      )
    })
    it('should deduplicate guest collections', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], [0, 1, 1, 1, 2]), [
        'a',
      ])
    })
    it('should handle undefined inputs', () => {
      assert.deepStrictEqual(findDifferencesBetweenCollections([0, 1, 2, 'a'], undefined), [
        0,
        1,
        2,
        'a',
      ])
      assert.deepStrictEqual(findDifferencesBetweenCollections(undefined, [0, 1, 2, 'a']), [])
      assert.deepStrictEqual(findDifferencesBetweenCollections(undefined, undefined), [])
    })
  })
})
