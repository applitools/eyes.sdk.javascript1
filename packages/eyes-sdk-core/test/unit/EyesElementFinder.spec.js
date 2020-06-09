'use strict'

const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')
const FakeWrappedElement = require('../utils/FakeWrappedElement')

describe('EyesElementFinder', () => {
  let mock, driver

  before(async () => {
    mock = new MockDriver()
    mock.mockElement('some selector', {index: 1})
    mock.mockElement('some selector', {index: 2})
    driver = new FakeWrappedDriver(new Logger(false), mock)
  })

  it('findElement(selector)', async () => {
    const expectedElement = await mock.findElement('some selector')
    const foundElement = await driver.finder.findElement('some selector')
    assert.ok(foundElement instanceof FakeWrappedElement)
    assert.deepStrictEqual(foundElement.elementId, expectedElement.id)
  })

  it('findElements(selector)', async () => {
    const expectedElements = await mock.findElements('iframe')
    const foundElements = await driver.finder.findElements('iframe')
    assert.strictEqual(foundElements.length, expectedElements.length)
    foundElements.forEach(foundElement => {
      assert.ok(foundElement instanceof FakeWrappedElement)
    })
    foundElements.forEach((foundElement, index) => {
      assert.deepStrictEqual(foundElement.elementId, expectedElements[index].id)
    })
  })
})
