'use strict'

const {By} = require('selenium-webdriver')
const {OSNames} = require('@applitools/eyes-common-legacy')
const {ImageProvider, MutableImage} = require('@applitools/eyes-sdk-core-legacy')

const {ScrollPositionProvider} = require('../ScrollPositionProvider')

/**
 * @private
 * @ignore
 */
class DeviceData {
  constructor(width, height, vpWidth, vpHeight) {
    this.width = width
    this.height = height
    this.vpWidth = vpWidth
    this.vpHeight = vpHeight
  }

  hashCode() {
    return this.width * 100000 + this.height * 1000 + this.vpWidth * 100 + this.vpHeight
  }
}

/**
 * @private
 * @ignore
 */
class RegionAndVersion {
  constructor(version, region) {
    this.majorVersion = version
    this.region = region
  }

  getMajorVersion() {
    return this.majorVersion
  }

  getRegion() {
    return this.region.getObject()
  }
}

/**
 * @private
 * @ignore
 */
class Region {
  constructor(left, top, width, height) {
    this.left = left
    this.top = top
    this.width = width
    this.height = height
  }

  getObject() {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
    }
  }
}

/**
 * @ignore
 */
class SafariScreenshotImageProvider extends ImageProvider {
  /**
   * @param {Eyes} eyes
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} tsInstance
   * @param {UserAgent} userAgent
   */
  constructor(eyes, logger, tsInstance, userAgent) {
    super()

    this._eyes = eyes
    this._logger = logger
    this._tsInstance = tsInstance
    this._userAgent = userAgent

    /** @type {Map<int, RegionAndVersion>} */
    this._devicesRegions = undefined
    this._jsExecutor = tsInstance
  }

  /**
   * @override
   * @return {Promise<MutableImage>}
   */
  getImage() {
    let /** @type MutableImage */ image, viewportSize
    const that = this
    that._logger.verbose('Getting screenshot as base64...')
    return that._tsInstance
      .takeScreenshot()
      .then(screenshot64 => {
        screenshot64 = screenshot64.replace(/\r\n/g, '') // Because of SauceLabs returns image with line breaks

        that._logger.verbose('Done getting base64! Creating MutableImage...')
        image = MutableImage.fromBase64(screenshot64, that._eyes._promiseFactory)
      })
      .then(() => {
        that._logger.verbose(`Done creating MutableImage.`)
        if (that._eyes.getIsCutProviderExplicitlySet()) {
          return image
        }

        const scaleRatio = that._eyes.getDevicePixelRatio()
        return that._eyes.getViewportSize().then(originalViewportSize => {
          viewportSize = {
            width: Math.ceil(originalViewportSize.width * scaleRatio),
            height: Math.ceil(originalViewportSize.height * scaleRatio),
          }

          that._logger.verbose(`logical viewport size: ${originalViewportSize}`)

          if (that._userAgent.getOS() === OSNames.IOS) {
            if (!this._devicesRegions) {
              this._initDeviceRegionsTable()
            }

            const imageWidth = image.getWidth()
            const imageHeight = image.getHeight()

            this._logger.verbose(`physical device pixel size: ${imageWidth} x ${imageHeight}`)

            const deviceData = new DeviceData(
              imageWidth,
              imageHeight,
              originalViewportSize.width,
              originalViewportSize.height,
            )

            if (this._devicesRegions.has(deviceData.hashCode())) {
              const majorVersion = parseInt(this._userAgent.getBrowserMajorVersion(), 10)
              this._logger.verbose('device model found in hash table')
              const cropByVersion = this._devicesRegions.get(deviceData.hashCode())
              if (cropByVersion.getMajorVersion() <= majorVersion) {
                return image.cropImage(cropByVersion.getRegion())
              } else {
                this._logger.verbose('device version not found in list. returning original image.')
              }
            } else {
              this._logger.verbose('device not found in list. returning original image.')
            }
          }

          if (!that._eyes.getForceFullPageScreenshot()) {
            const currentFrameChain = that._eyes._driver.getFrameChain()

            let promise
            if (currentFrameChain.size() === 0) {
              const positionProvider = new ScrollPositionProvider(
                that._logger,
                that._jsExecutor,
                that._eyes._promiseFactory,
              )
              promise = positionProvider.getCurrentPosition()
            } else {
              promise = that._eyes
                .getPromiseFactory()
                .resolve(currentFrameChain.getDefaultContentScrollPosition())
            }

            return promise.then(loc =>
              image.cropImage({
                left: loc.x * scaleRatio,
                top: loc.y * scaleRatio,
                width: viewportSize.width,
                height: viewportSize.height,
              }),
            )
          }

          return image
        })
      })
  }

  _initDeviceRegionsTable() {
    this._devicesRegions = new Map()

    // In JS, we need to maintain object reference if we want to use object as a key of Map.
    // But if we use primitive type, we don't need to. So, we call `hashCode` method to convert class to primitive
    this._devicesRegions.set(
      new DeviceData(828, 1792, 414, 719).hashCode(),
      new RegionAndVersion(12, new Region(0, 189, 828, 1436)),
    )
    this._devicesRegions.set(
      new DeviceData(1792, 828, 808, 364).hashCode(),
      new RegionAndVersion(12, new Region(88, 101, 1616, 685)),
    )
    this._devicesRegions.set(
      new DeviceData(1242, 2688, 414, 719).hashCode(),
      new RegionAndVersion(12, new Region(0, 283, 1242, 2155)),
    )
    this._devicesRegions.set(
      new DeviceData(2688, 1242, 808, 364).hashCode(),
      new RegionAndVersion(12, new Region(132, 151, 2424, 1028)),
    )

    this._devicesRegions.set(
      new DeviceData(1125, 2436, 375, 635).hashCode(),
      new RegionAndVersion(11, new Region(0, 283, 1125, 1903)),
    )
    this._devicesRegions.set(
      new DeviceData(2436, 1125, 724, 325).hashCode(),
      new RegionAndVersion(11, new Region(132, 151, 2436, 930)),
    )

    this._devicesRegions.set(
      new DeviceData(1242, 2208, 414, 622).hashCode(),
      new RegionAndVersion(11, new Region(0, 211, 1242, 1863)),
    )
    this._devicesRegions.set(
      new DeviceData(2208, 1242, 736, 364).hashCode(),
      new RegionAndVersion(11, new Region(0, 151, 2208, 1090)),
    )

    this._devicesRegions.set(
      new DeviceData(1242, 2208, 414, 628).hashCode(),
      new RegionAndVersion(10, new Region(0, 193, 1242, 1882)),
    )
    this._devicesRegions.set(
      new DeviceData(2208, 1242, 736, 337).hashCode(),
      new RegionAndVersion(10, new Region(0, 231, 2208, 1010)),
    )

    this._devicesRegions.set(
      new DeviceData(750, 1334, 375, 553).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 750, 1104)),
    )
    this._devicesRegions.set(
      new DeviceData(1334, 750, 667, 325).hashCode(),
      new RegionAndVersion(11, new Region(0, 101, 1334, 648)),
    )

    this._devicesRegions.set(
      new DeviceData(750, 1334, 375, 559).hashCode(),
      new RegionAndVersion(10, new Region(0, 129, 750, 1116)),
    )
    this._devicesRegions.set(
      new DeviceData(1334, 750, 667, 331).hashCode(),
      new RegionAndVersion(10, new Region(0, 89, 1334, 660)),
    )

    this._devicesRegions.set(
      new DeviceData(640, 1136, 320, 460).hashCode(),
      new RegionAndVersion(10, new Region(0, 129, 640, 918)),
    )
    this._devicesRegions.set(
      new DeviceData(1136, 640, 568, 232).hashCode(),
      new RegionAndVersion(10, new Region(0, 89, 1136, 462)),
    )

    this._devicesRegions.set(
      new DeviceData(1536, 2048, 768, 954).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 1536, 1907)),
    )
    this._devicesRegions.set(
      new DeviceData(2048, 1536, 1024, 698).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 2048, 1395)),
    )

    this._devicesRegions.set(
      new DeviceData(1536, 2048, 768, 922).hashCode(),
      new RegionAndVersion(11, new Region(0, 206, 1536, 1842)),
    )
    this._devicesRegions.set(
      new DeviceData(2048, 1536, 1024, 666).hashCode(),
      new RegionAndVersion(11, new Region(0, 206, 2048, 1330)),
    )

    this._devicesRegions.set(
      new DeviceData(1536, 2048, 768, 960).hashCode(),
      new RegionAndVersion(10, new Region(0, 129, 1536, 1919)),
    )
    this._devicesRegions.set(
      new DeviceData(2048, 1536, 1024, 704).hashCode(),
      new RegionAndVersion(10, new Region(0, 129, 2048, 1407)),
    )

    this._devicesRegions.set(
      new DeviceData(1536, 2048, 768, 928).hashCode(),
      new RegionAndVersion(10, new Region(0, 194, 1536, 1854)),
    )
    this._devicesRegions.set(
      new DeviceData(2048, 1536, 1024, 672).hashCode(),
      new RegionAndVersion(10, new Region(0, 194, 2048, 1342)),
    )

    this._devicesRegions.set(
      new DeviceData(2048, 2732, 1024, 1296).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 2048, 2591)),
    )
    this._devicesRegions.set(
      new DeviceData(2732, 2048, 1366, 954).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 2732, 1907)),
    )

    this._devicesRegions.set(
      new DeviceData(1668, 2224, 834, 1042).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 1668, 2083)),
    )
    this._devicesRegions.set(
      new DeviceData(2224, 1668, 1112, 764).hashCode(),
      new RegionAndVersion(11, new Region(0, 141, 2224, 1527)),
    )
  }
}

exports.SafariScreenshotImageProvider = SafariScreenshotImageProvider
