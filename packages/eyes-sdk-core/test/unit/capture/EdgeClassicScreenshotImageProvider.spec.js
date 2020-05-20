const EdgeClassicScreenshotImageProvider = require('../../../lib/capture/EdgeClassicScreenshotImageProvider')
const path = require('path')
const {readFileSync} = require('fs')
const {Logger} = require('../../../index')
const assert = require('assert')
const {isBlankImage} = require('@applitools/bitmap-commons')

function makeFakeDriver(pngBuffer) {
  let attemptedScreenshotsCount = 0

  function takeScreenshot() {
    attemptedScreenshotsCount++
    return pngBuffer.toString('base64')
  }

  function getAttemptedScreenshotsCount() {
    return attemptedScreenshotsCount
  }

  return {
    getAttemptedScreenshotsCount,
    controller: {
      takeScreenshot,
    },
  }
}

describe('EdgeClassicScreenshotImageProvider', () => {
  it('retries on an empty image', async () => {
    const image = readFileSync(path.resolve(__dirname, '..', '..', 'fixtures', 'blank-image.png'))
    const driver = makeFakeDriver(image)
    const imageProvider = new EdgeClassicScreenshotImageProvider(new Logger(false), driver)
    imageProvider.getImage()
    assert.deepStrictEqual(driver.getAttemptedScreenshotsCount(), 2)
  })
  it('check to see if customer provided image is blank', async () => {
    const pngBuffer = readFileSync(
      path.resolve(__dirname, '..', '..', 'fixtures', 'blank-image.png'),
    )
    const result = await isBlankImage({pngBuffer, rgbColor: [0, 0, 0]})
    assert.ok(result)
  })
  it.skip('does not retry when on a full image', () => {})
})
