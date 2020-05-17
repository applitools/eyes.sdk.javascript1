'use strict'

const {
  ArgumentGuard,
  BrowserNames,
  EyesScreenshot,
  CoordinatesType,
  Region,
  Location,
  RectangleSize,
  CoordinatesTypeConversionError,
  OutOfBoundsError,
} = require('@applitools/eyes-sdk-core')

const WDIOJSExecutor = require('../WDIOJSExecutor')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const FrameChain = require('../frames/FrameChain')

/**
 * @readonly
 * @enum {number}
 */
const ScreenshotType = {
  VIEWPORT: 1,
  ENTIRE_FRAME: 2,
}

class EyesWDIOScreenshot extends EyesScreenshot {
  /**
   * !WARNING! After creating new instance of EyesWebDriverScreenshot, it should be initialized by calling to init or initFromFrameSize method
   *
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver The web driver used to get the screenshot.
   * @param {MutableImage} image The actual screenshot image.
   */
  constructor(logger, driver, image) {
    super(image)

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')

    this._logger = logger
    this._driver = driver
    /** @type {FrameChain} */
    this._frameChain = driver.getFrameChain()
    /** @type {Location} */
    this._currentFrameScrollPosition = null
    /** @type {ScreenshotType} */
    this._screenshotType = null

    /**
     * The top/left coordinates of the frame window(!) relative to the top/left
     * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
     *
     * @type {Location} */
    this._frameLocationInScreenshot = null

    /**
     * The top/left coordinates of the frame window(!) relative to the top/left
     * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
     *
     * @type {Region} */
    this._frameWindow = null

    /**
     * @type {Region}
     */
    this._regionWindow = null
  }

  /**
   * Creates a frame(!) window screenshot.
   *
   * @param {RectangleSize} entireFrameSize The full internal size of the frame.
   * @return {Promise.<EyesWDIOScreenshot>}
   */
  async initFromFrameSize(entireFrameSize) {
    // The frame comprises the entire screenshot.
    this._screenshotType = ScreenshotType.ENTIRE_FRAME

    this._currentFrameScrollPosition = Location.ZERO
    this._frameLocationInScreenshot = Location.ZERO
    this._frameWindow = new Region(Location.ZERO, entireFrameSize)
    return this
  }

  /**
   * Creates a frame(!) window screenshot.
   *
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver The web driver used to get the screenshot.
   * @param {MutableImage} image The actual screenshot image.
   * @param {RectangleSize} entireFrameSize The full internal size of the frame.
   * @return {Promise<EyesWDIOScreenshot>}
   */
  static async fromFrameSize(logger, driver, image, entireFrameSize) {
    const screenshot = new EyesWDIOScreenshot(logger, driver, image)
    return screenshot.initFromFrameSize(entireFrameSize)
  }

  /**
   * Creates a frame(!) window screenshot from screenshot type and location.
   *
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} driver - The web driver used to get the screenshot.
   * @param {MutableImage} image - The actual screenshot image.
   * @param {ScreenshotType} [screenshotType] - The screenshot's type (e.g., viewport/full page).
   * @param {Location} [frameLocationInScreenshot[ - The current frame's location in the screenshot.
   * @param {boolean} [isMobile]
   * @return {Promise<EyesWDIOScreenshot>}
   */
  static async fromScreenshotType({
    logger,
    driver,
    image,
    screenshotType,
    frameLocationInScreenshot,
    isMobile = false,
  }) {
    const screenshot = new EyesWDIOScreenshot(logger, driver, image)

    screenshot._screenshotType = await screenshot._updateScreenshotType(screenshotType, image)
    const positionProvider = driver.eyes.getPositionProvider()

    let frameSize
    if (!isMobile) {
      screenshot._frameChain = driver.getFrameChain()
      frameSize = await screenshot._getFrameSize(positionProvider)

      screenshot._currentFrameScrollPosition = await screenshot._getUpdatedScrollPosition(
        positionProvider,
      )
      screenshot._frameLocationInScreenshot = await screenshot._getUpdatedFrameLocationInScreenshot(
        frameLocationInScreenshot,
      )

      logger.verbose('Calculating frame window...')
      screenshot._frameWindow = new Region(screenshot._frameLocationInScreenshot, frameSize)
    } else {
      screenshot._frameChain = new FrameChain(logger)
      screenshot._currentFrameScrollPosition = Location.ZERO
      screenshot._frameLocationInScreenshot = Location.ZERO

      screenshot._frameWindow = new Region(
        screenshot._frameLocationInScreenshot,
        new RectangleSize(image.getWidth(), image.getHeight()),
      )
    }

    screenshot._frameWindow.intersect(new Region(0, 0, image.getWidth(), image.getHeight()))

    if (screenshot._frameWindow.getWidth() <= 0 || screenshot._frameWindow.getHeight() <= 0) {
      throw new Error('Got empty frame window for screenshot!')
    }

    logger.verbose('Done!')
    return screenshot
  }

  /**
   * @param {ScreenshotType} [screenshotType] The screenshot's type (e.g., viewport/full page).
   * @param {Location} [frameLocationInScreenshot[ The current frame's location in the screenshot.
   * @return {Promise.<EyesWDIOScreenshot>}
   */
  init(screenshotType, frameLocationInScreenshot) {
    const that = this
    return that._updateScreenshotType(screenshotType, that._image).then(screenshotType => {
      that._screenshotType = screenshotType

      const positionProvider = that._driver.eyes.getPositionProvider()

      that._frameChain = that._driver.getFrameChain()
      return that._getFrameSize(positionProvider).then(frameSize => {
        return EyesWDIOScreenshot.getUpdatedScrollPosition(positionProvider)
          .then(currentFrameScrollPosition => {
            that._currentFrameScrollPosition = currentFrameScrollPosition
            return that._getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot)
          })
          .then(frameLocationInScreenshot => {
            that._frameLocationInScreenshot = frameLocationInScreenshot

            that._logger.verbose('Calculating frame window...')
            that._frameWindow = new Region(frameLocationInScreenshot, frameSize)
            that._frameWindow.intersect(
              new Region(0, 0, that._image.getWidth(), that._image.getHeight()),
            )
            if (that._frameWindow.getWidth() <= 0 || that._frameWindow.getHeight() <= 0) {
              throw new Error('Got empty frame window for screenshot!')
            }

            that._logger.verbose('Done!')
            return that
          })
      })
    })
  }

  /**
   * @param {Logger} logger
   * @param {FrameChain} currentFrames
   * @param {EyesWebDriver} driver
   * @return {Promise.<Location>}
   */
  static getDefaultContentScrollPosition(logger, currentFrames, driver) {
    const jsExecutor = new WDIOJSExecutor(driver)
    const positionProvider = new ScrollPositionProvider(logger, jsExecutor)
    if (currentFrames.size() === 0) {
      return positionProvider.getCurrentPosition()
    }

    const originalFC = new FrameChain(logger, currentFrames)

    const switchTo = driver.switchTo()
    return switchTo
      .defaultContent()
      .then(() => {
        return positionProvider.getCurrentPosition()
      })
      .then(defaultContentScrollPosition => {
        return switchTo.frames(originalFC).then(() => defaultContentScrollPosition)
      })
  }

  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {FrameChain} frameChain
   * @param {ScreenshotType} screenshotType
   * @return {Promise.<Location>}
   */
  static calcFrameLocationInScreenshot(logger, driver, frameChain, screenshotType) {
    return EyesWDIOScreenshot.getDefaultContentScrollPosition(logger, frameChain, driver).then(
      windowScroll => {
        logger.verbose('Getting first frame...')
        const firstFrame = frameChain.getFrame(0)
        logger.verbose('Done!')
        let locationInScreenshot = new Location(firstFrame.getLocation())

        // We only consider scroll of the default content if this is a viewport screenshot.
        if (screenshotType === ScreenshotType.VIEWPORT) {
          locationInScreenshot = locationInScreenshot.offset(
            -windowScroll.getX(),
            -windowScroll.getY(),
          )
        }

        logger.verbose('Iterating over frames..')
        let frame
        for (let i = 1, l = frameChain.size(); i < l; ++i) {
          logger.verbose('Getting next frame...')
          frame = frameChain.getFrame(i)
          logger.verbose('Done!')
          const frameLocation = frame.getLocation()
          // For inner frames we must consider the scroll
          const frameOriginalLocation = frame.getOriginalLocation()
          // Offsetting the location in the screenshot
          locationInScreenshot = locationInScreenshot.offset(
            frameLocation.getX() - frameOriginalLocation.getX(),
            frameLocation.getY() - frameOriginalLocation.getY(),
          )
        }

        logger.verbose('Done!')
        return locationInScreenshot
      },
    )
  }

  /**
   * @private
   * @param {Location} frameLocationInScreenshot
   * @return {Promise.<Location>}
   */
  async _getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot) {
    this._logger.verbose(`frameLocationInScreenshot: ${frameLocationInScreenshot}`)
    if (this._frameChain.size() > 0) {
      return EyesWDIOScreenshot.calcFrameLocationInScreenshot(
        this._logger,
        this._driver,
        this._frameChain,
        this._screenshotType,
      )
    } else if (!frameLocationInScreenshot) {
      return Location.ZERO
    }
    return frameLocationInScreenshot
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise<Location>}
   */
  async _getUpdatedScrollPosition(positionProvider) {
    try {
      const currentPosition = await positionProvider.getCurrentPosition()
      if (!currentPosition) {
        return new Location(Location.ZERO)
      }
      return currentPosition
    } catch (ignored) {
      return new Location(Location.ZERO)
    }
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise.<Location>}
   */
  static getUpdatedScrollPosition(positionProvider) {
    return positionProvider
      .getCurrentPosition()
      .then(sp => {
        if (!sp) {
          sp = new Location(0, 0)
        }
        return sp
      })
      .catch(() => {
        return new Location(0, 0)
      })
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise.<RectangleSize>}
   */
  async _getFrameSize(positionProvider) {
    if (this._frameChain.size() === 0) {
      // get entire page size might throw an exception for applications which don't support Javascript (e.g., Appium).
      // In that case we'll use the viewport size as the frame's size.
      const that = this
      return positionProvider.getEntireSize().catch(() => {
        return that._driver.getDefaultContentViewportSize()
      })
    } else {
      return this._frameChain.getCurrentFrameInnerSize()
    }
  }

  /**
   * @private
   * @param {ScreenshotType} screenshotType
   * @param {MutableImage} image
   * @return {Promise.<ScreenshotType>}
   */
  async _updateScreenshotType(screenshotType, image) {
    if (!screenshotType) {
      const that = this
      return that._driver.eyes.getViewportSize().then(viewportSize => {
        const scaleViewport = that._driver.eyes.shouldStitchContent()

        if (scaleViewport) {
          const pixelRatio = that._driver.eyes.getDevicePixelRatio()
          viewportSize = viewportSize.scale(pixelRatio)
        }

        // NOTE: Chrome on Android ends up with a 56 pixel difference between
        // the height of the image and the height of the viewport when they should
        // be identical -- or nearly the same after scaling (e.g., a viewport screenshot).
        // re: https://trello.com/c/PrGEKzhJ
        // TODO: revisit this fix as part of refactoring, or as part of the bigger redesign
        const heightCompensation = () => {
          const platformName = that._driver.remoteWebDriver.capabilities.platformName
          const browserName = that._driver.remoteWebDriver.capabilities.browserName
          let result =
            platformName &&
            platformName.toLowerCase() === 'android' &&
            browserName &&
            browserName.toLowerCase() === 'chrome'
              ? 56
              : 0
          // resolve possible off-by-one error (when the image is 1px bigger than the viewport size)
          if (image.getHeight() - (viewportSize.getHeight() + result) === 1) result++
          return result
        }

        const imageFitsInViewport = () => {
          const result =
            image.getWidth() <= viewportSize.getWidth() &&
            image.getHeight() <= viewportSize.getHeight() + heightCompensation()
          return result
        }

        if (
          imageFitsInViewport() ||
          (that._driver.eyes._checkSettings.getFrameChain().length > 0 && // workaround: define screenshotType as VIEWPORT
            that._driver.eyes._userAgent.getBrowser() === BrowserNames.Firefox &&
            parseInt(that._driver.eyes._userAgent.getBrowserMajorVersion(), 10) < 48)
        ) {
          return ScreenshotType.VIEWPORT
        } else {
          return ScreenshotType.ENTIRE_FRAME
        }
      })
    }
    return screenshotType
  }

  /**
   * @return {Region} The region of the frame which is available in the screenshot, in screenshot coordinates.
   */
  getFrameWindow() {
    return this._frameWindow
  }

  /**
   * @return {FrameChain} A copy of the frame chain which was available when the screenshot was created.
   */
  getFrameChain() {
    return new FrameChain(this._logger, this._frameChain)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @override
   * @param {Region} region The region for which we should get the sub screenshot.
   * @param {Boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise.<EyesWDIOScreenshot>} A screenshot instance containing the given region.
   */
  getSubScreenshot(region, throwIfClipped) {
    this._logger.verbose(`getSubScreenshot([${region}], ${throwIfClipped})`)

    ArgumentGuard.notNull(region, 'region')

    // We calculate intersection based on as-is coordinates.
    const asIsSubScreenshotRegion = this.getIntersectedRegion(
      region,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    // todo isSizeEmpty
    if (
      (asIsSubScreenshotRegion.getWidth() <= 0 && asIsSubScreenshotRegion.getHeight() <= 0) ||
      (throwIfClipped && !asIsSubScreenshotRegion.getSize().equals(region.getSize()))
    ) {
      throw new OutOfBoundsError(
        `Region [${region}] is out of screenshot bounds [${this._frameWindow}]`,
      )
    }

    const that = this
    return this._image
      .getImagePart(asIsSubScreenshotRegion)
      .then(subScreenshotImage => {
        const result = new EyesWDIOScreenshot(that._logger, that._driver, subScreenshotImage)
        return result.initFromFrameSize(
          new RectangleSize(subScreenshotImage.getWidth(), subScreenshotImage.getHeight()),
        )
      })
      .then(
        /** EyesWDIOScreenshot */ result => {
          result._frameLocationInScreenshot = new Location(-region.getLeft(), -region.getTop())
          that._logger.verbose('Done!')
          return result
        },
      )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
   *
   * @override
   * @param {Location} location The location which coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code location}.
   * @param {CoordinatesType} to The target coordinates type for {@code location}.
   * @return {Location} A new location which is the transformation of {@code location} to the {@code to} coordinates type.
   */
  convertLocation(location, from, to) {
    ArgumentGuard.notNull(location, 'location')
    ArgumentGuard.notNull(from, 'from')
    ArgumentGuard.notNull(to, 'to')

    let result = new Location(location)

    if (from === to) {
      return result
    }

    // If we're not inside a frame, and the screenshot is the entire page, then the context as-is/relative are the same (notice
    // screenshot as-is might be different, e.g., if it is actually a sub-screenshot of a region).
    if (this._frameChain.size() === 0 && this._screenshotType === ScreenshotType.ENTIRE_FRAME) {
      if (
        (from === CoordinatesType.CONTEXT_RELATIVE || from === CoordinatesType.CONTEXT_AS_IS) &&
        to === CoordinatesType.SCREENSHOT_AS_IS
      ) {
        // If this is not a sub-screenshot, this will have no effect.
        result = result.offset(
          this._frameLocationInScreenshot.getX(),
          this._frameLocationInScreenshot.getY(),
        )

        // FIXME: 18/03/2018 Region workaround
        // If this is not a region subscreenshot, this will have no effect.
        // result = result.offset(-this._regionWindow.getLeft(), -this._regionWindow.getTop());
      } else if (
        from === CoordinatesType.SCREENSHOT_AS_IS &&
        (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)
      ) {
        result = result.offset(
          -this._frameLocationInScreenshot.getX(),
          -this._frameLocationInScreenshot.getY(),
        )
      }
      return result
    }

    switch (from) {
      case CoordinatesType.CONTEXT_AS_IS:
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            result = result.offset(
              this._currentFrameScrollPosition.getX(),
              this._currentFrameScrollPosition.getY(),
            )
            break
          case CoordinatesType.SCREENSHOT_AS_IS:
            result = result.offset(
              this._frameLocationInScreenshot.getX(),
              this._frameLocationInScreenshot.getY(),
            )
            break
          default:
            throw new CoordinatesTypeConversionError(from, to)
        }
        break

      case CoordinatesType.CONTEXT_RELATIVE:
        switch (to) {
          case CoordinatesType.SCREENSHOT_AS_IS:
            // First, convert context-relative to context-as-is.
            result = result.offset(
              -this._currentFrameScrollPosition.getX(),
              -this._currentFrameScrollPosition.getY(),
            )
            // Now convert context-as-is to screenshot-as-is.
            result = result.offset(
              this._frameLocationInScreenshot.getX(),
              this._frameLocationInScreenshot.getY(),
            )
            break
          case CoordinatesType.CONTEXT_AS_IS:
            result = result.offset(
              -this._currentFrameScrollPosition.getX(),
              -this._currentFrameScrollPosition.getY(),
            )
            break
          default:
            throw new CoordinatesTypeConversionError(from, to)
        }
        break

      case CoordinatesType.SCREENSHOT_AS_IS:
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            // First convert to context-as-is.
            result = result.offset(
              -this._frameLocationInScreenshot.getX(),
              -this._frameLocationInScreenshot.getY(),
            )
            // Now convert to context-relative.
            result = result.offset(
              this._currentFrameScrollPosition.getX(),
              this._currentFrameScrollPosition.getY(),
            )
            break
          case CoordinatesType.CONTEXT_AS_IS:
            result = result.offset(
              -this._frameLocationInScreenshot.getX(),
              -this._frameLocationInScreenshot.getY(),
            )
            break
          default:
            throw new CoordinatesTypeConversionError(from, to)
        }
        break

      default:
        throw new CoordinatesTypeConversionError(from, to)
    }
    return result
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * @param {Location} location
   * @param {CoordinatesType} coordinatesType
   * @return {Location}
   */
  getLocationInScreenshot(location, coordinatesType) {
    this._location = this.convertLocation(
      location,
      coordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    // Making sure it's within the screenshot bounds
    if (!this._frameWindow.contains(location)) {
      throw new OutOfBoundsError(
        `Location ${location} ('${coordinatesType}') is not visible in screenshot!`,
      )
    }
    return this._location
  }

  /**
   * @override
   * @param {Region} region
   * @param {CoordinatesType} resultCoordinatesType
   * @return {Region}
   */
  getIntersectedRegion(region, resultCoordinatesType) {
    if (region.getWidth() <= 0 || region.getHeight() <= 0) {
      return new Region(region)
    }

    const originalCoordinatesType = region.getCoordinatesType()
    let intersectedRegion = this.convertRegionLocation(
      region,
      originalCoordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    switch (originalCoordinatesType) {
      // If the request was context based, we intersect with the frame window.
      case CoordinatesType.CONTEXT_AS_IS:
      case CoordinatesType.CONTEXT_RELATIVE:
        intersectedRegion.intersect(this._frameWindow)
        break
      // If the request is screenshot based, we intersect with the image
      case CoordinatesType.SCREENSHOT_AS_IS:
        intersectedRegion.intersect(
          new Region(0, 0, this._image.getWidth(), this._image.getHeight()),
        )
        break
      default:
        throw new CoordinatesTypeConversionError(
          `Unknown coordinates type: '${originalCoordinatesType}'`,
        )
    }

    // If the intersection is empty we don't want to convert the coordinates.
    if (intersectedRegion.isEmpty()) {
      return intersectedRegion
    }

    // Converting the result to the required coordinates type.
    intersectedRegion = this.convertRegionLocation(
      intersectedRegion,
      CoordinatesType.SCREENSHOT_AS_IS,
      resultCoordinatesType,
    )
    return intersectedRegion
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Gets the elements region in the screenshot.
   *
   * @param {WebElement} element The element which region we want to intersect.
   * @return {Promise.<Region>} The intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
   */
  getIntersectedRegionFromElement(element) {
    ArgumentGuard.notNull(element, 'element')

    const that = this
    return element.getLocation().then(point => {
      return element.getSize().then(size => {
        // Since the element coordinates are in context relative
        let elementRegion = new Region(point.x, point.y, size.width, size.height)

        // Since the element coordinates are in context relative
        elementRegion = that.getIntersectedRegion(elementRegion, CoordinatesType.CONTEXT_RELATIVE)

        if (!elementRegion.isEmpty()) {
          elementRegion = that.convertRegionLocation(
            elementRegion,
            CoordinatesType.CONTEXT_RELATIVE,
            CoordinatesType.SCREENSHOT_AS_IS,
          )
        }

        return elementRegion
      })
    })
  }

  /**
   *
   * @param {Region} region The region which location's coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code region}.
   * @param {CoordinatesType} to The target coordinates type for {@code region}.
   * @return {Region} A new region which is the transformation of {@code region} to the {@code to} coordinates type.
   */
  convertRegionLocation(region, from, to) {
    return super.convertRegionLocation(region, from, to)
  }
}

EyesWDIOScreenshot.ScreenshotType = Object.freeze(ScreenshotType)
module.exports = EyesWDIOScreenshot
