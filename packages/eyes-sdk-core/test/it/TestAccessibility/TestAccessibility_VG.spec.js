'use strict'
const MockDriver = require('../../utils/MockDriver')
const {runTest} = require('./TestAccessibility_utils')

describe('TestAccessibility', () => {
  let driver

  before(async () => {
    driver = new MockDriver()
    driver.mockElements([
      {selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {selector: 'element2', rect: {x: 30, y: 31, width: 301, height: 302}},
    ])
  })

  it('TestAccessibility_VG', async () => {
    await runTest(driver, true)
  })
})
