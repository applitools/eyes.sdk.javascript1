'use strict'

const assert = require('assert')

const {PerformanceUtils} = require('../../../index')

describe('PerformanceUtils', function() {
  it('should stop timer and should return execution time', function() {
    PerformanceUtils.start('test')
    const result = PerformanceUtils.end('test')
    assert.ok(result.time > 0)
  })

  it('should stop timer and return execution time without name', function() {
    const time = PerformanceUtils.start()
    const result = time.end()
    assert.ok(result.time > 0)
  })

  it('should return execution time', function() {
    PerformanceUtils.start('test3')
    PerformanceUtils.end('test3')

    const elapsed = PerformanceUtils.result('test3')
    assert.ok(elapsed)
  })

  describe('elapsedString()', () => {
    it('should return correct amount of seconds', () => {
      assert.strictEqual(PerformanceUtils.elapsedString(6000), '6s 0ms')
    })

    it('should return correct amount of sec and ms', () => {
      assert.strictEqual(PerformanceUtils.elapsedString(6456), '6s 456ms')
    })

    it('should return correct amount of min, sec', () => {
      assert.strictEqual(PerformanceUtils.elapsedString(61000), '1m 1s 0ms')
    })

    it('should return correct amount of min, sec and ms', () => {
      assert.strictEqual(PerformanceUtils.elapsedString(156458), '2m 36s 458ms')
    })
  })
})
