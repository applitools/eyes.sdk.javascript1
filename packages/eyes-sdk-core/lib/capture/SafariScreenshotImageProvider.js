'use strict'
const OSNames = require('../useragent/OSNames')
const Region = require('../geometry/Region')
const ImageProvider = require('./ImageProvider')
const EyesUtils = require('../sdk/EyesUtils')

class SafariScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWrappedDriver} driver
   * @param {Eyes} eyes
   * @param {UserAgent} userAgent
   */
  constructor(logger, driver, rotation, eyes, userAgent) {
    super()

    this._logger = logger
    this._driver = driver
    this._rotation = rotation
    this._eyes = eyes
    this._userAgent = userAgent
  }

  set rotation(rotation) {
    this._rotation = rotation
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    this._logger.verbose('Getting screenshot as base64...')
    const image = await this._driver.takeScreenshot()
    if (this._rotation) {
      await image.rotate(this._rotation)
    }
    await this._eyes.getDebugScreenshotsProvider().save(image, 'SAFARI')

    if (this._eyes.getIsCutProviderExplicitlySet()) {
      return image
    }

    const scaleRatio = this._eyes.getDevicePixelRatio()
    const originalViewportSize = await this._eyes.getViewportSize()
    const viewportSize = originalViewportSize.scale(scaleRatio)

    this._logger.verbose(`logical viewport size: ${originalViewportSize}`)

    if (this._userAgent.getOS() === OSNames.IOS) {
      this._logger.verbose(`physical device pixel size: ${image.getWidth()}x${image.getHeight()}`)

      const resolutions = devicesRegions.get(hashSize(image.getWidth(), image.getHeight()))

      if (resolutions) {
        const widthRatio = image.getWidth() / originalViewportSize.getWidth()
        const height = widthRatio * originalViewportSize.getHeight()

        if (Math.abs(height - image.getHeight()) > 1.5) {
          let bestMatchingRect = resolutions[0]
          let bestHeightDiff = Math.abs(bestMatchingRect.getHeight() - height)
          for (let i = 1; i < resolutions.length; i++) {
            const rect = resolutions[i]
            const heightDiff = Math.abs(rect.getHeight() - height)
            if (heightDiff < bestHeightDiff) {
              bestHeightDiff = heightDiff
              bestMatchingRect = rect
            }
          }
          this._logger.verbose('closest crop rect found: {0}', bestMatchingRect)

          await image.crop(bestMatchingRect)
        } else {
          this._logger.verbose('no crop needed. must be using chrome emulator.')
        }
      }
    } else if (
      this._userAgent.getBrowserMajorVersion() === '11' &&
      !this._eyes.getForceFullPageScreenshot()
    ) {
      const location = await EyesUtils.getScrollOffset(this._logger, this._driver.mainContext)
      await image.crop(new Region(location.scale(scaleRatio), viewportSize))
    }

    return image
  }
}

// In JS, we need to maintain object reference if we want to use object as a key of Map.
// But if we use primitive type, we don't need to. So, we call `hashCode` method to convert class to primitive
// TODO maybe move to RectangleSize class
function hashSize(width, height) {
  return width * 100000 + height * 1000
}

/** @type {Map<int, [Region]>} */
const devicesRegions = new Map([
  [
    hashSize(1536, 2048),
    [
      new Region(0, 141, 1536, 1907),
      new Region(0, 206, 1536, 1842),
      new Region(0, 129, 1536, 1919),
      new Region(0, 194, 1536, 1854),
    ],
  ],
  [
    hashSize(2048, 1536),
    [
      new Region(0, 141, 2048, 1395),
      new Region(0, 206, 2048, 1330),
      new Region(0, 129, 2048, 1407),
      new Region(0, 194, 2048, 1342),
    ],
  ],
  [hashSize(828, 1792), [new Region(0, 189, 828, 1436)]],
  [hashSize(1792, 828), [new Region(88, 101, 1616, 685)]],
  [hashSize(1242, 2688), [new Region(0, 283, 1242, 2155)]],
  [hashSize(2688, 1242), [new Region(132, 151, 2424, 1028)]],
  [hashSize(1125, 2436), [new Region(0, 283, 1125, 1903)]],
  [hashSize(2436, 1125), [new Region(132, 151, 2172, 930)]],
  [hashSize(1242, 2208), [new Region(0, 211, 1242, 1863), new Region(0, 193, 1242, 1882)]],
  [hashSize(2208, 1242), [new Region(0, 151, 2208, 1090), new Region(0, 231, 2208, 1010)]],
  [hashSize(750, 1334), [new Region(0, 141, 750, 1104), new Region(0, 129, 750, 1116)]],
  [hashSize(1334, 750), [new Region(0, 101, 1334, 648), new Region(0, 89, 1334, 660)]],
  [hashSize(640, 1136), [new Region(0, 129, 640, 918)]],
  [hashSize(1136, 640), [new Region(0, 89, 1136, 462)]],
  [hashSize(2048, 2732), [new Region(0, 141, 2048, 2591)]],
  [hashSize(2732, 2048), [new Region(0, 141, 2732, 1907)]],
  [hashSize(1668, 2224), [new Region(0, 141, 1668, 2083)]],
  [hashSize(2224, 1668), [new Region(0, 141, 2224, 1527)]],
])

module.exports = SafariScreenshotImageProvider
