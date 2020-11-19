'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const {VisualGridRunner, RunnerOptions} = require('../../../')

describe('VisualGridRunner', () => {
  it('sets correct testConcurrency with plain object input', () => {
    const runner = new VisualGridRunner({testConcurrency: 3})
    expect(runner.testConcurrency).to.equal(3)
    expect(runner.legacyConcurrency).to.be.undefined
  })

  it('sets correct testConcurrency with RunnerOptions input', () => {
    const runner = new VisualGridRunner(RunnerOptions().testConcurrency(3))
    expect(runner.testConcurrency).to.equal(3)
    expect(runner.legacyConcurrency).to.be.undefined
  })

  it('sets correct testConcurrency with legacy concurrency input', () => {
    const runner = new VisualGridRunner(3)
    expect(runner.testConcurrency).to.be.undefined
    expect(runner.legacyConcurrency).to.equal(3)
  })
})
