'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const getFinalConcurrency = require('../../../src/sdk/getFinalConcurrency')

describe('getFinalConcurrency', () => {
  it('returns number for testConcurrency', () => {
    expect(getFinalConcurrency({testConcurrency: 3})).to.equal(3)
    expect(getFinalConcurrency({testConcurrency: '3'})).to.equal(3)
    expect(getFinalConcurrency({testConcurrency: 'x'})).to.be.NaN
  })

  it('testConcurrency overrides concurrency', () => {
    expect(getFinalConcurrency({testConcurrency: 3, concurrency: 4})).to.equal(3)
    expect(getFinalConcurrency({testConcurrency: 'x', concurrency: 4})).to.be.NaN
  })

  it('concurrency factor of 5', () => {
    expect(getFinalConcurrency({concurrency: 4})).to.equal(20)
  })

  it('return number for concurrency', () => {
    expect(getFinalConcurrency({concurrency: 'x'})).to.be.NaN
  })
})
