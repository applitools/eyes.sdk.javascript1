'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const BrowserNames = require('../useragent/BrowserNames')
const CoordinatesType = require('../geometry/CoordinatesType')
const Region = require('../geometry/Region')
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const CoordinatesTypeConversionError = require('../errors/CoordinatesTypeConversionError')
const OutOfBoundsError = require('../errors/OutOfBoundsError')
const Enum = require('../utils/Enum')

/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('../images/MutableImage')} MutableImage
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 */

/**
 * @typedef {number} ScreenshotType
 */

const ScreenshotTypes = Enum('ScreenshotType', {
  VIEWPORT: 1,
  ENTIRE_FRAME: 2,
})

/**
 * Class for handling screenshots.
 */
class EyesScreenshot {
  /**
   * !WARNING! After creating new instance of EyesScreenshot, it should be initialized by calling
   * to init or initFromFrameSize method
   * @param {Logger} logger - logger instance
   * @param {Eyes} eyes - web eyes used to get the screenshot
   * @param {MutableImage} image - actual screenshot image
   */
  constructor(logger, eyes, image) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(eyes, 'eyes')
    ArgumentGuard.notNull(image, 'image')
    this._logger = logger
    this._image = image
    this._eyes = eyes
    this._context = eyes._context
    /** @type {ScreenshotType} */
    this._screenshotType = null
    /** @type {Location} */
    this._currentFrameScrollPosition = null
    /**
     * The top/left coordinates of the frame window(!) relative to the top/left
     * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
     * @type {Location}
     */
    this._frameLocationInScreenshot = null
    /** @type {RectangleSize} */
    this._frameSize = null
    /**
     * The top/left coordinates of the frame window(!) relative to the top/left
     * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
     * @type {Region}
     */
    this._frameRect = null
  }

  /**
   * Detect screenshot type of image
   * @param {MutableImage} image - actual screenshot image
   * @param {Eyes} eyes - eyes instance used to get the screenshot
   * @return {Promise<ScreenshotType>}
   */
  static async getScreenshotType(image, eyes) {
    let viewportSize = await eyes.getViewportSize()
    const scaleViewport = eyes.shouldStitchContent()
    if (scaleViewport) {
      const pixelRatio = eyes.getDevicePixelRatio()
      viewportSize = viewportSize.scale(pixelRatio)
    }

    if (
      (image.getWidth() <= viewportSize.getWidth() &&
        image.getHeight() <= viewportSize.getHeight()) ||
      (eyes._checkSettings.getContext() && // workaround: define screenshotType as VIEWPORT
        eyes._userAgent.getBrowser() === BrowserNames.Firefox &&
        Number.parseInt(eyes._userAgent.getBrowserMajorVersion(), 10) < 48)
    ) {
      return ScreenshotTypes.VIEWPORT
    } else {
      return ScreenshotTypes.ENTIRE_FRAME
    }
  }

  /**
   * Creates a frame(!) window screenshot
   * @param {Logger} logger - logger instance
   * @param {Eyes} eyes - eyes instance used to get the screenshot
   * @param {MutableImage} image - actual screenshot image
   * @param {RectangleSize} entireFrameSize - full internal size of the frame
   * @return {Promise<EyesScreenshot>}
   */
  static async fromFrameSize(logger, eyes, image, entireFrameSize) {
    const screenshot = new EyesScreenshot(logger, eyes, image)
    return screenshot.initFromFrameSize(entireFrameSize)
  }

  /**
   * Creates a frame(!) window screenshot from screenshot type and location
   * @param {Logger} logger - Logger instance
   * @param {Eyes} eyes - eyes instance used to get the screenshot
   * @param {MutableImage} image - actual screenshot image
   * @param {ScreenshotType} [screenshotType] - screenshot's type (e.g., viewport/full page)
   * @param {Location} [frameLocationInScreenshot] - current frame's location in the screenshot
   * @return {Promise<EyesScreenshot>}
   */
  static async fromScreenshotType(logger, eyes, image, screenshotType, frameLocationInScreenshot) {
    const screenshot = new EyesScreenshot(logger, eyes, image)
    return screenshot.init(screenshotType, frameLocationInScreenshot)
  }

  /**
   * Creates a frame(!) window screenshot.
   * @param {RectangleSize} entireFrameSize - full internal size of the frame
   * @return {Promise<EyesScreenshot>}
   */
  async initFromFrameSize(entireFrameSize) {
    // The frame comprises the entire screenshot.
    this._screenshotType = ScreenshotTypes.ENTIRE_FRAME

    this._currentFrameScrollPosition = Location.ZERO
    this._frameLocationInScreenshot = Location.ZERO
    this._frameSize = entireFrameSize
    this._frameRect = new Region(Location.ZERO, entireFrameSize)
    return this
  }

  /**
   * @param {ScreenshotType} [screenshotType] - screenshot's type (e.g., viewport/full page)
   * @return {Promise<EyesScreenshot>}
   */
  async init(screenshotType) {
    this._screenshotType =
      screenshotType || (await EyesScreenshot.getScreenshotType(this._image, this._eyes))
    this._context = this._eyes._context

    // TODO this throws exception on mobile native apps
    this._currentFrameScrollPosition = await this._context
      .getInnerOffset()
      .catch(() => Location.ZERO)

    this._frameLocationInScreenshot = this._context.isMain
      ? Location.ZERO
      : await this._context.getLocationInViewport()
    this._frameSize = await this._context.getClientSize()

    this._logger.verbose('Calculating frame window...')
    this._frameRect = new Region(this._frameLocationInScreenshot, this._frameSize)
    this._frameRect.intersect(new Region(0, 0, this._image.getWidth(), this._image.getHeight()))
    if (this._frameRect.isSizeEmpty()) {
      throw new Error('Got empty frame window for screenshot!')
    }

    this._logger.verbose('Done!')
    return this
  }

  /**
   * @return {MutableImage} - screenshot image
   */
  getImage() {
    return this._image
  }

  /**
   * @return {Region} - region of the frame which is available in the screenshot, in screenshot coordinates
   */
  getFrameWindow() {
    return this._frameRect
  }

  /**
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
    if (!this._frameRect.contains(location)) {
      throw new OutOfBoundsError(
        `Location ${location} ('${coordinatesType}') is not visible in screenshot!`,
      )
    }
    return this._location
  }

  /**
   * @param {Region} region
   * @param {CoordinatesType} resultCoordinatesType
   * @return {Region}
   */
  getIntersectedRegion(region, resultCoordinatesType) {
    if (region.isSizeEmpty()) {
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
        intersectedRegion.intersect(this._frameRect)
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

  /**
   * @param {Region} region - region which location's coordinates needs to be converted.
   * @param {CoordinatesType} from - current coordinates type for {@code region}.
   * @param {CoordinatesType} to - target coordinates type for {@code region}.
   * @return {Region} new region which is the transformation of {@code region} to the {@code to} coordinates type.
   */
  convertRegionLocation(region, from, to) {
    ArgumentGuard.notNull(region, 'region')

    if (region.isSizeEmpty()) {
      return new Region(region)
    }

    ArgumentGuard.notNull(from, 'from')
    ArgumentGuard.notNull(to, 'to')

    const updatedLocation = this.convertLocation(region.getLocation(), from, to)

    return new Region(updatedLocation, region.getSize())
  }

  /**
   * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
   * @param {Location} location - location which coordinates needs to be converted.
   * @param {CoordinatesType} from - current coordinates type for {@code location}.
   * @param {CoordinatesType} to - target coordinates type for {@code location}.
   * @return {Location} new location which is the transformation of {@code location} to the {@code to} coordinates type.
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
    // if (this._context.isMain && this._screenshotType === ScreenshotTypes.ENTIRE_FRAME) {
    //   if (
    //     (from === CoordinatesType.CONTEXT_RELATIVE || from === CoordinatesType.CONTEXT_AS_IS) &&
    //     to === CoordinatesType.SCREENSHOT_AS_IS
    //   ) {
    //     // If this is not a sub-screenshot, this will have no effect.
    //     result = result.offset(
    //       this._frameLocationInScreenshot.getX(),
    //       this._frameLocationInScreenshot.getY(),
    //     )

    //     // FIXME: 18/03/2018 Region workaround
    //     // If this is not a region subscreenshot, this will have no effect.
    //     // result = result.offset(-this._regionWindow.getLeft(), -this._regionWindow.getTop());
    //   } else if (
    //     from === CoordinatesType.SCREENSHOT_AS_IS &&
    //     (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)
    //   ) {
    //     result = result.offset(
    //       -this._frameLocationInScreenshot.getX(),
    //       -this._frameLocationInScreenshot.getY(),
    //     )
    //   }
    //   return result
    // }

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

  /**
   * Gets the elements region in the screenshot.
   * @param {EyesWrappedElement} element - element which region we want to intersect.
   * @return {Promise<Region>} intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
   */
  async getIntersectedRegionFromElement(element) {
    ArgumentGuard.notNull(element, 'element')

    let region = await element.getRect()

    // Since the element coordinates are in context relative
    region = this.getIntersectedRegion(region, CoordinatesType.CONTEXT_RELATIVE)

    if (!region.isEmpty()) {
      region = this.convertRegionLocation(
        region,
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS,
      )
    }

    return region
  }

  /**
   * Returns a part of the screenshot based on the given region.
   * @param {Region} region - region for which we should get the sub screenshot.
   * @param {Boolean} throwIfClipped - throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesScreenshot>} screenshot instance containing the given region.
   */
  async getSubScreenshot(region, throwIfClipped) {
    this._logger.verbose(`getSubScreenshot([${region}], ${throwIfClipped})`)

    ArgumentGuard.notNull(region, 'region')

    // We calculate intersection based on as-is coordinates.
    const asIsSubScreenshotRegion = this.getIntersectedRegion(
      region,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    if (
      asIsSubScreenshotRegion.isSizeEmpty() ||
      (throwIfClipped && !asIsSubScreenshotRegion.getSize().equals(region.getSize()))
    ) {
      throw new OutOfBoundsError(
        `Region [${region}] is out of screenshot bounds [${this._frameRect}]`,
      )
    }

    const imagePart = await this._image.getImagePart(asIsSubScreenshotRegion)
    const screenshot = await EyesScreenshot.fromFrameSize(
      this._logger,
      this._eyes,
      imagePart,
      new RectangleSize(imagePart.getWidth(), imagePart.getHeight()),
    )
    screenshot._frameLocationInScreenshot = new Location(-region.getLeft(), -region.getTop())
    this._logger.verbose('Done!')
    return screenshot
  }
}

EyesScreenshot.ScreenshotTypes = ScreenshotTypes
module.exports = EyesScreenshot
