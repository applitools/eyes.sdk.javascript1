'use strict'
const assert = require('assert')
const WDIOWrappedElement = require('../../src/WDIOWrappedElement')
const WDIOWrappedDriver = require('../../src/WDIOWrappedDriver')
const {Logger} = require('../../index')

describe('LegacyAPIElement', function() {
  let logger,
    driver,
    element = {ELEMENT: 'element'},
    selector = 'selector'

  function elementId(element) {
    return element.ELEMENT || element['element-6066-11e4-a52e-4f735466cecf']
  }

  before(async () => {
    logger = new Logger(false)
    driver = new WDIOWrappedDriver(logger, {})
  })

  it('get element', async () => {
    const wrappedElement = new WDIOWrappedElement(logger, driver, element)
    assert.deepStrictEqual(wrappedElement.element, wrappedElement.unwrapped)
    assert.strictEqual(elementId(wrappedElement.element), elementId(element))
  })

  it('get locator', async () => {
    const wrappedElement = new WDIOWrappedElement(logger, driver, element, selector)
    assert.strictEqual(wrappedElement.locator, wrappedElement.selector)
    assert.strictEqual(wrappedElement.locator, selector)
  })
})
