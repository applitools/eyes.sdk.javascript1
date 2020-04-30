'use strict'
const assert = require('assert')
const WDIODriver = require('../../src/wrappers/WDIODriver')
const WDIOElementFinder = require('../../src/wrappers/WDIOElementFinder')
const WDIOBrowsingContext = require('../../src/wrappers/WDIOBrowsingContext')
const WDIOJSExecutor = require('../../src/wrappers/WDIOJSExecutor')
const {Logger} = require('../../index')

describe('WDIODriver', function() {
  let logger,
    browser = {}

  before(async () => {
    logger = new Logger(false)
  })

  it('get executor', async () => {
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.executor instanceof WDIOJSExecutor)
  })

  it('get context', async () => {
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.context instanceof WDIOBrowsingContext)
  })

  it('get finder', async () => {
    const driver = new WDIODriver(logger, browser)
    assert.ok(driver.finder instanceof WDIOElementFinder)
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
    const driver = new WDIODriver(logger, browser)
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
