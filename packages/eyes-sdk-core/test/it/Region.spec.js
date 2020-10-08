'use strict'

const assert = require('assert')
const {Region} = require('../../index')

describe('Region', function() {
  let driver
  before(() => {
    driver = {
      executeScript: async (_script, element) => `xpath of ${element}`,
      findElements: async locator => [`webelement of ${locator.value}`],
    }
  })

  it('toPersistedRegions', async function() {
    const region = new Region({left: 1, top: 2, width: 3, height: 4})
    const [{left, top, width, height}] = await region.toPersistedRegions(driver)
    assert.deepStrictEqual({left, top, width, height}, {left: 1, top: 2, width: 3, height: 4})
  })
})
