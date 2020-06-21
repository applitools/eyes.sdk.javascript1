// re: Trello 382: https://trello.com/c/UBr0w3UF/382-wdio6-with-wdio5-service-viewport-size-not-being-applied
const assert = require('assert')
const {getWindowSize, setWindowSize} = require('../../src/SpecWrappedDriver')

describe('SpecWrappedDriver', async () => {
  describe('support unimplemented getWindowRect/setWindowRect functions', () => {
    it('uses getWindowRect when available', async () => {
      const driver = {
        getWindowRect: () => {
          return {x: 1, y: 1, width: 1, height: 1}
        },
      }
      assert.deepStrictEqual(await getWindowSize(driver), {width: 1, height: 1})
    })
    it('uses setWindowRect when available', async () => {
      const driver = {
        setWindowRect: (x, y, width, height) => {
          return {x, y, width, height}
        },
      }
      assert.deepStrictEqual(await setWindowSize(driver, {width: 1, height: 1}), {
        x: null,
        y: null,
        width: 1,
        height: 1,
      })
    })
    it('falls back when getWindowRect not available', async () => {
      const driver = {
        getWindowSize: () => {
          return {width: 1, height: 1}
        },
      }
      assert.deepStrictEqual(await getWindowSize(driver), {width: 1, height: 1})
    })
    it('falls back when setWindowRect not available', async () => {
      const driver = {
        setWindowSize: (width, height) => {
          return {width, height}
        },
      }
      const location = {width: 1, height: 1}
      assert.deepStrictEqual(await setWindowSize(driver, location), {width: 1, height: 1})
    })
  })
})
