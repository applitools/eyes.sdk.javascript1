;(function() {
  'use strict'

  var EyesSDK = require('@applitools/eyes-sdk-core-legacy'),
    EyesUtils = require('@applitools/eyes-common-legacy'),
    ScrollPositionProvider = require('../ScrollPositionProvider').ScrollPositionProvider,
    FrameChain = require('../FrameChain').FrameChain
  var EyesScreenshot = EyesSDK.EyesScreenshot,
    CoordinatesType = EyesSDK.CoordinatesType,
    ArgumentGuard = EyesUtils.ArgumentGuard,
    GeneralUtils = EyesUtils.GeneralUtils,
    GeometryUtils = EyesUtils.GeometryUtils

  /**
   * @readonly
   * @enum {number}
   */
  var ScreenshotType = {
    VIEWPORT: 1,
    ENTIRE_FRAME: 2,
  }

  /**
   *
   * @param {Logger} logger
   * @param {FrameChain} frameChain
   * @param {ScreenshotType} screenshotType
   * @return {{x: number, y: number}}
   */
  var calcFrameLocationInScreenshot = function(logger, frameChain, screenshotType) {
    logger.verbose('Getting first frame..')
    var firstFrame = frameChain.getFrame(0)
    logger.verbose('Done!')
    var locationInScreenshot = GeometryUtils.createLocationFromLocation(firstFrame.getLocation())

    // We only consider scroll of the default content if this is a viewport screenshot.
    if (screenshotType === ScreenshotType.VIEWPORT) {
      var defaultContentScroll = firstFrame.getParentScrollPosition()
      locationInScreenshot = GeometryUtils.locationOffset(
        locationInScreenshot,
        defaultContentScroll,
      )
    }

    logger.verbose('Iterating over frames..')
    var frame
    for (var i = 1, l = frameChain.size(); i < l; ++i) {
      logger.verbose('Getting next frame...')
      frame = frameChain.getFrames()[i]
      logger.verbose('Done!')

      var frameLocation = frame.getLocation()

      // For inner frames we must consider the scroll
      var frameParentScrollPosition = frame.getParentScrollPosition()

      // Offsetting the location in the screenshot
      locationInScreenshot = GeometryUtils.locationOffset(locationInScreenshot, {
        x: frameLocation.x - frameParentScrollPosition.x,
        y: frameLocation.y - frameParentScrollPosition.y,
      })
    }

    logger.verbose('Done!')
    return locationInScreenshot
  }

  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver The web driver used to get the screenshot.
   * @param {MutableImage} image The actual screenshot image.
   * @param {PromiseFactory} promiseFactory
   * @augments EyesScreenshot
   * @constructor
   */
  function EyesWebDriverScreenshot(logger, driver, image, promiseFactory) {
    EyesScreenshot.call(this, image)

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')

    this._logger = logger
    this._driver = driver
    this._image = image
    this._promiseFactory = promiseFactory
    this._frameChain = driver.getFrameChain()
  }

  EyesWebDriverScreenshot.prototype = new EyesScreenshot()
  EyesWebDriverScreenshot.prototype.constructor = EyesWebDriverScreenshot

  /**
   * @param {ScreenshotType} [screenshotType] The screenshot's type (e.g., viewport/full page).
   * @param {{x: number, y: number}} [frameLocationInScreenshot] The current frame's location in the screenshot.
   * @param {{width: number, height: number}} [frameSize] The full internal size of the frame.
   * @return {Promise<void>}
   */
  EyesWebDriverScreenshot.prototype.buildScreenshot = function(
    screenshotType,
    frameLocationInScreenshot,
    frameSize,
  ) {
    var that = this
    var positionProvider = new ScrollPositionProvider(
      this._logger,
      this._driver,
      this._promiseFactory,
    )

    return that
      ._updateScreenshotType(screenshotType, that._image)
      .then(function(screenshotType) {
        that._screenshotType = screenshotType
        return that._driver.isMobileDevice()
      })
      .then(function(isMobileDevice) {
        if (!isMobileDevice) {
          return that
            ._getUpdatedScrollPosition(positionProvider)
            .then(function(sp) {
              that._currentFrameScrollPosition = sp
              return that._updateFrameLocationInScreenshot(frameLocationInScreenshot)
            })
            .then(function() {
              return that._getFrameSize(positionProvider)
            })
            .then(function(frameSize) {
              that._logger.verbose('Calculating frame window...')
              that._frameWindow = GeometryUtils.createRegionFromLocationAndSize(
                that._frameLocationInScreenshot,
                frameSize,
              )
            })
        } else {
          that._currentFrameScrollPosition = GeometryUtils.createLocation(0, 0)
          that._frameLocationInScreenshot = GeometryUtils.createLocation(0, 0)
          that._frameWindow = GeometryUtils.createRegionFromLocationAndSize(
            that._frameLocationInScreenshot,
            that._image.getSize(),
          )
        }
      })
      .then(function() {
        var imageSize = that._image.getSize()
        if (
          GeometryUtils.isRegionsIntersected(
            that._frameWindow,
            GeometryUtils.createRegion(0, 0, imageSize.width, imageSize.height),
          )
        ) {
          that._frameWindow = GeometryUtils.intersect(
            that._frameWindow,
            GeometryUtils.createRegion(0, 0, imageSize.width, imageSize.height),
          )
        }

        if (that._frameWindow.width <= 0 || that._frameWindow.height <= 0) {
          throw new Error('Got empty frame window for screenshot!')
        }

        that._logger.verbose('EyesWebDriverScreenshot - Done!')
      })
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise<{width: number, height: number}>}
   */
  EyesWebDriverScreenshot.prototype._getFrameSize = function(positionProvider) {
    var that = this
    if (this._frameChain.size() !== 0) {
      return this._promiseFactory.resolve(this._frameChain.getCurrentFrameSize())
    }

    return this._driver.isMobileDevice().then(function(isMobileDevice) {
      if (isMobileDevice) {
        return positionProvider.getEntireSize()
      }

      return that._driver.getDefaultContentViewportSize(false)
    })
  }

  /**
   * @private
   * @param {ScreenshotType} screenshotType
   * @param {MutableImage} image
   * @return {Promise<ScreenshotType>}
   */
  EyesWebDriverScreenshot.prototype._updateScreenshotType = function(screenshotType, image) {
    var that = this
    if (!screenshotType) {
      return that._driver
        .getEyes()
        .getViewportSize()
        .then(function(viewportSize) {
          if (image.getWidth() <= viewportSize.width && image.getHeight() <= viewportSize.height) {
            screenshotType = ScreenshotType.VIEWPORT
          } else {
            screenshotType = ScreenshotType.ENTIRE_FRAME
          }
          return screenshotType
        })
    }
    return that._promiseFactory.resolve(screenshotType)
  }

  /**
   * @private
   * @param {{x: number, y: number}} location
   * @return {Promise}
   */
  EyesWebDriverScreenshot.prototype._updateFrameLocationInScreenshot = function(location) {
    if (!location) {
      if (this._frameChain.size() > 0) {
        this._frameLocationInScreenshot = calcFrameLocationInScreenshot(
          this._logger,
          this._frameChain,
          this._screenshotType,
        )
      } else {
        this._frameLocationInScreenshot = GeometryUtils.createLocation(0, 0)
      }
    } else {
      this._frameLocationInScreenshot = location
    }
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise<{width: number, height: number}>}
   */
  EyesWebDriverScreenshot.prototype._getUpdatedScrollPosition = function(positionProvider) {
    return positionProvider
      .getCurrentPosition()
      .then(function(sp) {
        if (!sp) {
          sp = GeometryUtils.createLocation(0, 0)
        }
        return sp
      })
      .catch(function() {
        return GeometryUtils.createLocation(0, 0)
      })
  }

  /**
   * @return {{left: number, top: number, width: number, height: number}} The region of the frame which is available in the screenshot,
   * in screenshot coordinates.
   */
  EyesWebDriverScreenshot.prototype.getFrameWindow = function() {
    return this._frameWindow
  }

  /**
   * @return {FrameChain} A copy of the frame chain which was available when the
   * screenshot was created.
   */
  EyesWebDriverScreenshot.prototype.getFrameChain = function() {
    return new FrameChain(this._logger, this._frameWindow)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @param {{left: number, top: number, width: number, height: number}} region The region for which we should get the sub screenshot.
   * @param {CoordinatesType} coordinatesType How should the region be calculated on the screenshot image.
   * @param {boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesWebDriverScreenshot>} A screenshot instance containing the given region.
   */
  EyesWebDriverScreenshot.prototype.getSubScreenshot = function(
    region,
    coordinatesType,
    throwIfClipped,
  ) {
    var that = this
    this._logger.verbose(
      'getSubScreenshot(',
      region,
      ', ',
      coordinatesType,
      ', ',
      throwIfClipped,
      ')',
    )

    ArgumentGuard.notNull(region, 'region')
    ArgumentGuard.notNull(coordinatesType, 'coordinatesType')

    // We calculate intersection based on as-is coordinates.
    var asIsSubScreenshotRegion = this.getIntersectedRegion(
      region,
      coordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    if (
      GeometryUtils.isRegionEmpty(asIsSubScreenshotRegion) ||
      (throwIfClipped &&
        !(
          region.height === asIsSubScreenshotRegion.height &&
          region.width === asIsSubScreenshotRegion.width
        ))
    ) {
      throw new Error(
        'Region ' +
          JSON.stringify(region) +
          ', (' +
          coordinatesType +
          ') is out of screenshot bounds ' +
          JSON.stringify(this._frameWindow),
      )
    }

    return this._image.cropImage(asIsSubScreenshotRegion).then(function(subScreenshotImage) {
      // The frame location in the sub screenshot is the negative of the
      // context-as-is location of the region.
      var contextAsIsRegionLocation = that.convertLocationFromLocation(
        GeometryUtils.createLocationFromRegion(asIsSubScreenshotRegion),
        CoordinatesType.SCREENSHOT_AS_IS,
        CoordinatesType.CONTEXT_AS_IS,
      )

      var frameLocationInSubScreenshot = GeometryUtils.createLocation(
        -contextAsIsRegionLocation.x,
        -contextAsIsRegionLocation.y,
      )

      var result = new EyesWebDriverScreenshot(
        that._logger,
        that._driver,
        subScreenshotImage,
        that._promiseFactory,
      )
      return result
        .buildScreenshot(that._screenshotType, frameLocationInSubScreenshot, null)
        .then(function() {
          that._logger.verbose('Done!')
          return result
        })
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Converts a location's coordinates with the {@code from} coordinates type
   * to the {@code to} coordinates type.
   *
   * @param {{x: number, y: number}} location The location which coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code location}.
   * @param {CoordinatesType} to The target coordinates type for {@code location}.
   * @return {{x: number, y: number}} A new location which is the transformation of {@code location} to the {@code to} coordinates type.
   */
  EyesWebDriverScreenshot.prototype.convertLocationFromLocation = function(location, from, to) {
    ArgumentGuard.notNull(location, 'location')
    ArgumentGuard.notNull(from, 'from')
    ArgumentGuard.notNull(to, 'to')

    var result = {x: location.x, y: location.y}

    if (from === to) {
      return result
    }

    // If we're not inside a frame, and the screenshot is the entire
    // page, then the context as-is/relative are the same (notice
    // screenshot as-is might be different, e.g.,
    // if it is actually a sub-screenshot of a region).
    if (this._frameChain.size() === 0 && this._screenshotType === ScreenshotType.ENTIRE_FRAME) {
      if (
        (from === CoordinatesType.CONTEXT_RELATIVE || from === CoordinatesType.CONTEXT_AS_IS) &&
        to === CoordinatesType.SCREENSHOT_AS_IS
      ) {
        // If this is not a sub-screenshot, this will have no effect.
        result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot)
      } else if (
        from === CoordinatesType.SCREENSHOT_AS_IS &&
        (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)
      ) {
        result = GeometryUtils.locationOffset(result, {
          x: -this._frameLocationInScreenshot.x,
          y: -this._frameLocationInScreenshot.y,
        })
      }
      return result
    }

    switch (from) {
      case CoordinatesType.CONTEXT_AS_IS:
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            result = GeometryUtils.locationOffset(result, this._currentFrameScrollPosition)
            break

          case CoordinatesType.SCREENSHOT_AS_IS:
            result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot)
            break

          default:
            throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
        }
        break

      case CoordinatesType.CONTEXT_RELATIVE:
        switch (to) {
          case CoordinatesType.SCREENSHOT_AS_IS:
            // First, convert context-relative to context-as-is.
            result = GeometryUtils.locationOffset(result, {
              x: -this._currentFrameScrollPosition.x,
              y: -this._currentFrameScrollPosition.y,
            })
            // Now convert context-as-is to screenshot-as-is.
            result = GeometryUtils.locationOffset(result, this._frameLocationInScreenshot)
            break

          case CoordinatesType.CONTEXT_AS_IS:
            result = GeometryUtils.locationOffset(result, {
              x: -this._currentFrameScrollPosition.x,
              y: -this._currentFrameScrollPosition.y,
            })
            break

          default:
            throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
        }
        break

      case CoordinatesType.SCREENSHOT_AS_IS:
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            // First convert to context-as-is.
            result = GeometryUtils.locationOffset(result, {
              x: -this._frameLocationInScreenshot.x,
              y: -this._frameLocationInScreenshot.y,
            })
            // Now convert to context-relative.
            result = GeometryUtils.locationOffset(result, {
              x: -this._currentFrameScrollPosition.x,
              y: -this._currentFrameScrollPosition.y,
            })
            break

          case CoordinatesType.CONTEXT_AS_IS:
            result = GeometryUtils.locationOffset(result, {
              x: -this._frameLocationInScreenshot.x,
              y: -this._frameLocationInScreenshot.y,
            })
            break

          default:
            throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
        }
        break

      default:
        throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
    }
    return result
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {{x: number, y: number}} location
   * @param {CoordinatesType} coordinatesType
   * @return {{x: number, y: number}}
   */
  EyesWebDriverScreenshot.prototype.getLocationInScreenshot = function(location, coordinatesType) {
    this._location = this.convertLocationFromLocation(
      location,
      coordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    // Making sure it's within the screenshot bounds
    if (!GeometryUtils.isRegionContainsLocation(this._frameWindow, location)) {
      throw new Error(
        'Location ' + location + " ('" + coordinatesType + "') is not visible in screenshot!",
      )
    }
    return this._location
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {{left: number, top: number, width: number, height: number}} region
   * @param {CoordinatesType} originalCoordinatesType
   * @param {CoordinatesType} resultCoordinatesType
   * @return {{left: number, top: number, width: number, height: number}}
   */
  EyesWebDriverScreenshot.prototype.getIntersectedRegion = function(
    region,
    originalCoordinatesType,
    resultCoordinatesType,
  ) {
    if (GeometryUtils.isRegionEmpty(region)) {
      return GeneralUtils.clone(region)
    }

    var intersectedRegion = this.convertRegionLocation(
      region,
      originalCoordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    switch (originalCoordinatesType) {
      // If the request was context based, we intersect with the frame
      // window.
      case CoordinatesType.CONTEXT_AS_IS:
      case CoordinatesType.CONTEXT_RELATIVE:
        GeometryUtils.intersect(intersectedRegion, this._frameWindow)
        break

      // If the request is screenshot based, we intersect with the image
      case CoordinatesType.SCREENSHOT_AS_IS:
        GeometryUtils.intersect(
          intersectedRegion,
          GeometryUtils.createRegion(0, 0, this._image.width, this._image.height),
        )
        break

      default:
        throw new Error("Unknown coordinates type: '" + originalCoordinatesType + "'")
    }

    // If the intersection is empty we don't want to convert the
    // coordinates.
    if (GeometryUtils.isRegionEmpty(intersectedRegion)) {
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
   * @return {Promise<{left: number, top: number, width: number, height: number}>} The intersected region, in {@code SCREENSHOT_AS_IS} coordinates
   * type.
   */
  EyesWebDriverScreenshot.prototype.getIntersectedRegionFromElement = function(element) {
    ArgumentGuard.notNull(element, 'element')

    var pl, ds
    return element
      .getLocation()
      .then(function(location) {
        pl = location
        return element.getSize()
      })
      .then(function(size) {
        ds = size

        // Since the element coordinates are in context relative
        var region = this.getIntersectedRegion(
          GeometryUtils.createRegionFromLocationAndSize(pl, ds),
          CoordinatesType.CONTEXT_RELATIVE,
          CoordinatesType.CONTEXT_RELATIVE,
        )

        if (!GeometryUtils.isRegionEmpty(region)) {
          region = this.convertRegionLocation(
            region,
            CoordinatesType.CONTEXT_RELATIVE,
            CoordinatesType.SCREENSHOT_AS_IS,
          )
        }

        return region
      })
  }

  exports.EyesWebDriverScreenshot = EyesWebDriverScreenshot
})()
