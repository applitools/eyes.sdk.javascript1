'use strict'
const assert = require('assert')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')
const {Logger, By} = require('../../index')

describe('LegacyWrappedDriver', function() {
  let logger, driver

  before(async () => {
    logger = new Logger(false)
  })

  it('driver.click', async () => {
    driver = new WDIOWrappedDriver(logger, {
      click: selector => assert.strictEqual(selector, 'css selector:some-selector'),
    })
    await driver.click(By.cssSelector('some-selector'))
  })

  it('driver.executeScript', async () => {
    driver = new WDIOWrappedDriver(logger, {
      execute: async (script, ...args) => {
        return {value: {script, args}}
      },
    })
    const {script, args} = await driver.executeScript('some script', 'arg1', 'arg2')
    assert.strictEqual(script, 'some script')
    assert.deepStrictEqual(args, ['arg1', 'arg2'])
  })

  it('driver.executeAsyncScript', async () => {
    driver = new WDIOWrappedDriver(logger, {
      executeAsync: async (script, ...args) => {
        return {script, args}
      },
    })
    const {script, args} = await driver.executeAsyncScript('some script', 'arg1', 'arg2')
    assert.strictEqual(script, 'some script')
    assert.deepStrictEqual(args, ['arg1', 'arg2'])
  })

  it('driver.findElement', async () => {
    driver = new WDIOWrappedDriver(logger, {
      element: async selector => {
        return {value: {ELEMENT: selector}}
      },
    })
    const result = await driver.findElement(By.cssSelector('some-selector'))
    assert.deepStrictEqual(result.element, {
      ELEMENT: 'css selector:some-selector',
      'element-6066-11e4-a52e-4f735466cecf': 'css selector:some-selector',
    })
  })

  it('driver.findElements', async () => {
    driver = new WDIOWrappedDriver(logger, {
      elements: async selector => {
        return {value: [{ELEMENT: selector}]}
      },
    })
    const [result] = await driver.findElements(By.cssSelector('some-selector'))
    assert.deepStrictEqual(result.element, {
      ELEMENT: 'css selector:some-selector',
      'element-6066-11e4-a52e-4f735466cecf': 'css selector:some-selector',
    })
  })
})
