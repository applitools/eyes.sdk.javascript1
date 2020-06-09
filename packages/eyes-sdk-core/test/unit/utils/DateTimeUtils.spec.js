'use strict'

const assert = require('assert')

const {DateTimeUtils} = require('../../../index')

describe('DateTimeUtils', () => {
  describe('toISO8601DateTime()', () => {
    it('should return formatted string', () => {
      const date = new Date(1520616682000)
      assert.strictEqual(DateTimeUtils.toISO8601DateTime(date), '2018-03-09T17:31:22Z')
    })
  })

  describe('toRfc1123DateTime()', () => {
    it('should return formatted string', () => {
      const date = new Date(1520616682000)
      assert.strictEqual(DateTimeUtils.toRfc1123DateTime(date), 'Fri, 09 Mar 2018 17:31:22 GMT')
    })
  })

  describe('toLogFileDateTime()', () => {
    it('should return formatted string', () => {
      const date = new Date(1520616682332)
      assert.strictEqual(DateTimeUtils.toLogFileDateTime(date, true), '2018_03_09__17_31_22_332')
    })
  })

  describe('fromISO8601DateTime()', () => {
    it('should return formatted string', () => {
      const input = '2018-03-09T17:31:22Z'

      assert.strictEqual(DateTimeUtils.fromISO8601DateTime(input).getTime(), 1520616682000)
    })
  })
})
