const assert = require('assert')
const {setViewportSize} = require('../../../lib/sdk/EyesUtils')
const RectangleSize = require('../../../lib/geometry/RectangleSize')

describe('EyesUtils', () => {
  describe('setViewportSize', () => {
    it('works', async () => {
      let windowRect
      const counters = {
        setWindowRect: 0,
      }
      const logger = {
        verbose: () => {},
      }
      const context = {
        execute: () => {
          const result = windowRect || {width: 1280, height: 800}
          return new RectangleSize(result)
        },
        driver: {
          setWindowRect: async input => {
            if (input && input._width && input._height) {
              windowRect = input
              counters.setWindowRect++
            }
          },
          getWindowRect: () => {
            const result = windowRect || {width: 1280, height: 800}
            return new RectangleSize(result)
          },
        },
      }
      const requiredViewportSize = new RectangleSize({width: 800, height: 600})
      // eslint-disable-next-line
      await setViewportSize(logger, context, requiredViewportSize)
      assert.deepStrictEqual(counters.setWindowRect, 1)
    })
    it('throws the correct error when unable to set the viewport size', () => {
      const logger = {
        verbose: () => {},
      }
      const context = {
        execute: () => {
          return {width: 1280, height: 800}
        },
        driver: {
          setWindowRect: async () => {},
          getWindowRect: () => {
            return new RectangleSize({width: 1280, height: 800})
          },
        },
      }
      const requiredViewportSize = new RectangleSize({width: 800, height: 600})
      // eslint-disable-next-line
      return assert.rejects(async () => {await setViewportSize(logger, context, requiredViewportSize)}, /Failed to set viewport size!/)
    })
  })
})
