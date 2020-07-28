'use strict'
const assert = require('assert')
const {Logger} = require('../../index')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')
const MockDriver = require('../utils/MockDriver')

describe('EyesWrappedController', () => {
  let logger, controller

  before(async () => {
    logger = new Logger(false)
    const driver = new FakeWrappedDriver(logger, new MockDriver({isNative: true}))
    controller = driver.controller
  })

  it('skip unnecessary method calls on native mode', async () => {
    const title = await controller.getTitle()
    const source = await controller.getSource()
    assert.strictEqual(title, null)
    assert.strictEqual(source, null)
  })
})
