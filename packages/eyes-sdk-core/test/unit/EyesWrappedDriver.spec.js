'use strict'
const assert = require('assert')
const {Logger} = require('../../index')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')

describe('EyesWrappedDriver', () => {
  let logger

  before(async () => {
    logger = new Logger(false)
  })

  it('get executor', async () => {
    const browser = {}
    const driver = new FakeWrappedDriver(logger, browser)
    assert.ok(driver.executor instanceof FakeWrappedDriver.JsExecutor)
  })

  it('get context', async () => {
    const browser = {}
    const driver = new FakeWrappedDriver(logger, browser)
    assert.ok(driver.context instanceof FakeWrappedDriver.BrowsingContext)
  })

  it('get finder', async () => {
    const browser = {}
    const driver = new FakeWrappedDriver(logger, browser)
    assert.ok(driver.finder instanceof FakeWrappedDriver.ElementFinder)
  })

  it('preserve native API', async () => {
    const browser = {
      someField: Symbol('someField'),
      someMethod() {
        return this.someField
      },
      async someAsyncMethod() {
        return this.someField
      },
    }
    const driver = new FakeWrappedDriver(logger, browser)
    Object.keys(browser).forEach(async propName => {
      if (typeof browser[propName] === 'function') {
        let browserResult = browser[propName]()
        let driverResult = driver[propName]()
        if (typeof browserResult.then === 'function') {
          browserResult = await browserResult
        }
        if (typeof driverResult.then === 'function') {
          driverResult = await driverResult
        }
        assert.strictEqual(browserResult, driverResult)
      } else {
        assert.strictEqual(browser[propName], driver[propName])
      }
    })
  })
})
