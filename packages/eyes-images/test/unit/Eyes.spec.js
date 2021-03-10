const {Eyes, RectangleSize} = require('../..')
const assert = require('assert')

describe('Eyes', () => {
  it('getScreenshot', async () => {
    const eyes = new Eyes()
    eyes._screenshotProvider = {
      getImage: async () => {
        return {image: new RectangleSize(800, 600)}
      },
    }
    // eslint-disable-next-line
    await assert.doesNotReject(async () => {
      await eyes.getScreenshot()
    })
  })
})
