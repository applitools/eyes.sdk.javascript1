'use strict'
const assert = require('assert')
const {Logger, Location, RectangleSize, Region} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')
const FakeWrappedElement = require('../utils/FakeWrappedElement')

describe('FakeWrappedElement', function() {
  let logger, mock, driver

  before(async () => {
    logger = new Logger(false)
    mock = new MockDriver()
    mock.mockElement('some selector', {
      rect: {x: 0, y: 100, width: 500, height: 1000},
      styles: {
        'border-left-width': '4px',
        'border-top-width': '20px',
      },
      props: {
        someProp: 'string',
        otherProp: 77,
      },
    })
    driver = new FakeWrappedDriver(logger, mock)
  })

  it('static isCompatible(element)', async () => {
    const element = await mock.findElement('some selector')
    assert.ok(FakeWrappedElement.isCompatible(element))
  })

  it('static isCompatible(wrong)', async () => {
    const element = await mock.findElement('some wrong selector')
    assert.ok(!FakeWrappedElement.isCompatible(element))
  })

  it('static extractId(element)', async () => {
    const element = await mock.findElement('some selector')
    assert.strictEqual(await FakeWrappedElement.extractId(element), element.id)
  })

  it('static extractId(elementWrapper)', async () => {
    const element = await mock.findElement('some selector')
    const elementWrapper = new FakeWrappedElement(logger, driver, element)
    assert.strictEqual(await FakeWrappedElement.extractId(elementWrapper), element.id)
  })

  it('constructor(element)', async () => {
    const element = await mock.findElement('some selector')
    const constructed = new FakeWrappedElement(logger, driver, element)
    assert.strictEqual(constructed.elementId, await FakeWrappedElement.extractId(element))
  })

  it('constructor(elementWrapper)', async () => {
    const elementWrapper = await driver.finder.findElement('some selector')
    const constructed = new FakeWrappedElement(logger, driver, elementWrapper)
    assert.strictEqual(constructed, elementWrapper)
  })

  it('getLocation()', async () => {
    const element = await driver.finder.findElement('some selector')
    const location = await element.getLocation()
    assert.ok(location instanceof Location)
    assert.strictEqual(location.getX(), Math.ceil(element.unwrapped.rect.x))
    assert.strictEqual(location.getY(), Math.ceil(element.unwrapped.rect.y))
  })

  it('getSize()', async () => {
    const element = await driver.finder.findElement('some selector')
    const size = await element.getSize()
    assert.ok(size instanceof RectangleSize)
    assert.strictEqual(size.getWidth(), Math.ceil(element.unwrapped.rect.width))
    assert.strictEqual(size.getHeight(), Math.ceil(element.unwrapped.rect.height))
  })

  it('getRect()', async () => {
    const element = await driver.finder.findElement('some selector')
    const rect = await element.getRect()
    assert.ok(rect instanceof Region)
    assert.strictEqual(rect.getLeft(), Math.ceil(element.unwrapped.rect.x))
    assert.strictEqual(rect.getTop(), Math.ceil(element.unwrapped.rect.y))
    assert.strictEqual(rect.getWidth(), Math.ceil(element.unwrapped.rect.width))
    assert.strictEqual(rect.getHeight(), Math.ceil(element.unwrapped.rect.height))
  })

  it('getProperty(propertyName)', async () => {
    const element = await driver.finder.findElement('some selector')
    const propertyValue = await element.getProperty('someProp')
    assert.strictEqual(propertyValue, element.unwrapped.props.someProp)
  })

  it('getProperty(...propertyNames)', async () => {
    const element = await driver.finder.findElement('some selector')
    const propertyValues = await element.getProperty('someProp', 'otherProp')
    assert.deepStrictEqual(propertyValues, [
      element.unwrapped.props.someProp,
      element.unwrapped.props.otherProp,
    ])
  })

  it('getCssProperty(propertyName)', async () => {
    const propertyName = 'border-left-width'
    const element = await driver.finder.findElement(`some selector`)
    const propertyValue = await element.getCssProperty(propertyName)
    assert.strictEqual(propertyValue, element.unwrapped.styles[propertyName])
  })

  it('getCssProperty(...propertyNames)', async () => {
    const propertyNames = ['border-left-width', 'border-top-width']
    const element = await driver.finder.findElement(`some selector`)
    const propertyValues = await element.getCssProperty(...propertyNames)
    assert.deepStrictEqual(
      propertyValues,
      propertyNames.map(propertyName => element.unwrapped.styles[propertyName]),
    )
  })
})
