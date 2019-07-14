'use strict';

const { ArgumentGuard, CoordinatesType, Region, Location, RectangleSize } = require('@applitools/eyes-common');
const { EyesScreenshot, CoordinatesTypeConversionError, OutOfBoundsError } = require('@applitools/eyes-sdk-core');

const { SeleniumJavaScriptExecutor } = require('../SeleniumJavaScriptExecutor');
const { ScrollPositionProvider } = require('../positioning/ScrollPositionProvider');
const { FrameChain } = require('../frames/FrameChain');

/**
 * @readonly
 * @enum {number}
 */
const ScreenshotType = {
  VIEWPORT: 1,
  ENTIRE_FRAME: 2,
};

/**
 * @ignore
 */
class EyesWebDriverScreenshot extends EyesScreenshot {
  /**
   * @private
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} driver - The web driver used to get the screenshot.
   * @param {MutableImage} image - The actual screenshot image.
   */
  constructor(logger, driver, image) {
    super(image);

    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(driver, 'driver');

    this._logger = logger;
    this._driver = driver;
    /** @type {FrameChain} */
    this._frameChain = driver.getFrameChain();
    /** @type {Location} */
    this._currentFrameScrollPosition = null;
    /** @type {ScreenshotType} */
    this._screenshotType = null;

    /**
     * The top/left coordinates of the frame window(!) relative to the top/left of the screenshot. Used for
     * calculations, so can also be outside(!) the screenshot.
     *
     * @type {Location} */
    this._frameLocationInScreenshot = null;

    /**
     * The top/left coordinates of the frame window(!) relative to the top/left of the screenshot. Used for
     * calculations, so can also be outside(!) the screenshot.
     *
     * @type {Region} */
    this._frameWindow = null;

    /**
     * @type {Region}
     */
    this._regionWindow = null;
  }

  /**
   * Creates a frame(!) window screenshot.
   *
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} driver - The web driver used to get the screenshot.
   * @param {MutableImage} image - The actual screenshot image.
   * @param {RectangleSize} entireFrameSize - The full internal size of the frame.
   * @return {Promise<EyesWebDriverScreenshot>}
   */
  static async fromFrameSize(logger, driver, image, entireFrameSize) {
    const screenshot = new EyesWebDriverScreenshot(logger, driver, image);
    // The frame comprises the entire screenshot.
    screenshot._screenshotType = ScreenshotType.ENTIRE_FRAME;

    screenshot._currentFrameScrollPosition = Location.ZERO;
    screenshot._frameLocationInScreenshot = Location.ZERO;
    screenshot._frameWindow = new Region(Location.ZERO, entireFrameSize);
    screenshot._regionWindow = new Region(0, 0, 0, 0);
    return screenshot;
  }

  /**
   * Creates a frame(!) window screenshot.
   *
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} driver - The web driver used to get the screenshot.
   * @param {MutableImage} image - The actual screenshot image.
   * @param {Region} screenshotRegion - The region of the screenshot.
   * @return {Promise<EyesWebDriverScreenshot>}
   */
  static async fromFrameRegion(logger, driver, image, screenshotRegion) {
    const screenshot = new EyesWebDriverScreenshot(logger, driver, image);
    // The frame comprises the entire screenshot.
    screenshot._screenshotType = ScreenshotType.ENTIRE_FRAME;

    screenshot._currentFrameScrollPosition = Location.ZERO;
    screenshot._frameLocationInScreenshot = Location.ZERO;
    screenshot._frameWindow = new Region(Location.ZERO, screenshotRegion.getSize());
    screenshot._regionWindow = new Region(screenshotRegion);
    return screenshot;
  }

  /**
   * Creates a frame(!) window screenshot from screenshot type and location.
   *
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver} driver - The web driver used to get the screenshot.
   * @param {MutableImage} image - The actual screenshot image.
   * @param {ScreenshotType} [screenshotType] - The screenshot's type (e.g., viewport/full page).
   * @param {Location} [frameLocationInScreenshot[ The current frame's location in the screenshot.
   * @return {Promise<EyesWebDriverScreenshot>}
   */
  static async fromScreenshotType(logger, driver, image, screenshotType = ScreenshotType.VIEWPORT, frameLocationInScreenshot = Location.ZERO) {
    const screenshot = new EyesWebDriverScreenshot(logger, driver, image);

    screenshot._screenshotType = await screenshot._updateScreenshotType(screenshotType, image);

    let positionProvider = driver.getEyes().getCurrentFramePositionProvider();
    if (!positionProvider) {
      positionProvider = driver.getEyes().getPositionProvider();
    }

    screenshot._frameChain = driver.getFrameChain();
    const frameSize = await screenshot._getFrameSize(positionProvider);

    screenshot._currentFrameScrollPosition = await screenshot._getUpdatedScrollPosition(positionProvider);
    screenshot._frameLocationInScreenshot = await screenshot._getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot);

    logger.verbose('Calculating frame window...');
    screenshot._frameWindow = new Region(screenshot._frameLocationInScreenshot, frameSize);
    screenshot._frameWindow.intersect(new Region(0, 0, image.getWidth(), image.getHeight()));

    if (screenshot._frameWindow.getWidth() <= 0 || screenshot._frameWindow.getHeight() <= 0) {
      throw new Error('Got empty frame window for screenshot!');
    }

    screenshot._regionWindow = new Region(0, 0, 0, 0);
    logger.verbose('Done!');
    return screenshot;
  }

  /**
   * @private
   * @return {Promise<Location>}
   */
  async _getDefaultContentScrollPosition() {
    const jsExecutor = new SeleniumJavaScriptExecutor(this._driver);
    let defaultContentScrollPosition;
    if (this._frameChain.size() === 0) {
      defaultContentScrollPosition = await this._getCurrentFrameScrollRootElement(jsExecutor);
    } else {
      const originalFC = new FrameChain(this._logger, this._frameChain);
      const switchTo = this._driver.switchTo();
      const currentFC = this._driver.getEyes().getOriginalFC();
      await switchTo.frames(currentFC);
      defaultContentScrollPosition = await this._getCurrentFrameScrollRootElement(jsExecutor);
      await switchTo.frames(originalFC);
    }
    return defaultContentScrollPosition;
  }

  /**
   * @private
   * @return {Promise<Location>}
   */
  async _getCurrentFrameScrollRootElement(executor) {
    const scrollRootElement = await this._driver.getEyes().getCurrentFrameScrollRootElement();
    const positionProvider = new ScrollPositionProvider(this._logger, executor, scrollRootElement);
    return positionProvider.getCurrentPosition();
  }

  /**
   * @private
   * @return {Promise<Location>}
   */
  async _calcFrameLocationInScreenshot() {
    const windowScroll = await this._getDefaultContentScrollPosition();
    this._logger.verbose('Getting first frame...');
    const firstFrame = this._frameChain.getFrame(0);
    this._logger.verbose('Done!');
    let locationInScreenshot = new Location(firstFrame.getLocation());

    // We only consider scroll of the default content if this is a viewport screenshot.
    if (this._screenshotType === ScreenshotType.VIEWPORT) {
      locationInScreenshot = locationInScreenshot.offset(-windowScroll.getX(), -windowScroll.getY());
    }

    this._logger.verbose('Iterating over frames...');
    let frame;
    for (let i = 1, l = this._frameChain.size(); i < l; i += 1) {
      this._logger.verbose('Getting next frame...');
      frame = this._frameChain.getFrame(i);
      this._logger.verbose('Done!');
      const frameLocation = frame.getLocation();
      // For inner frames we must consider the scroll
      const frameOriginalLocation = frame.getOriginalLocation();
      // Offsetting the location in the screenshot
      locationInScreenshot = locationInScreenshot.offset(
        frameLocation.getX() - frameOriginalLocation.getX(),
        frameLocation.getY() - frameOriginalLocation.getY()
      );
    }

    this._logger.verbose('Done!');
    return locationInScreenshot;
  }

  /**
   * @private
   * @param {Location} frameLocationInScreenshot
   * @return {Promise<Location>}
   */
  async _getUpdatedFrameLocationInScreenshot(frameLocationInScreenshot) {
    this._logger.verbose(`frameLocationInScreenshot: ${frameLocationInScreenshot}`);

    if (this._frameChain.size() > 0) {
      return this._calcFrameLocationInScreenshot();
    }

    if (!frameLocationInScreenshot) {
      return new Location(Location.ZERO);
    }

    return frameLocationInScreenshot;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise<Location>}
   */
  async _getUpdatedScrollPosition(positionProvider) {
    try {
      const currentPosition = await positionProvider.getCurrentPosition();
      if (!currentPosition) {
        return new Location(Location.ZERO);
      }
      return currentPosition;
    } catch (ignored) {
      return new Location(Location.ZERO);
    }
  }

  /**
   * @private
   * @param {PositionProvider} positionProvider
   * @return {Promise<RectangleSize>}
   */
  async _getFrameSize(positionProvider) {
    if (this._frameChain.size() === 0) {
      // get entire page size might throw an exception for applications which don't support Javascript (e.g., Appium).
      // In that case we'll use the viewport size as the frame's size.
      try {
        return await positionProvider.getEntireSize();
      } catch (ignored) {
        return this._driver.getDefaultContentViewportSize();
      }
    }

    return this._frameChain.getCurrentFrameInnerSize();
  }

  /**
   * @private
   * @param {ScreenshotType} screenshotType
   * @param {MutableImage} image
   * @return {Promise<ScreenshotType>}
   */
  async _updateScreenshotType(screenshotType, image) {
    if (!screenshotType) {
      let viewportSize = await this._driver.getEyes().getViewportSize();
      const scaleViewport = this._driver.getEyes().shouldStitchContent();

      if (scaleViewport) {
        const pixelRatio = this._driver.getEyes().getDevicePixelRatio();
        viewportSize = viewportSize.scale(pixelRatio);
      }

      if (image.getWidth() <= viewportSize.getWidth() && image.getHeight() <= viewportSize.getHeight()) {
        return ScreenshotType.VIEWPORT;
      }
      return ScreenshotType.ENTIRE_FRAME;
    }

    return screenshotType;
  }

  /**
   * @return {Region} - The region of the frame which is available in the screenshot, in screenshot coordinates.
   */
  getFrameWindow() {
    return this._frameWindow;
  }

  /**
   * @return {FrameChain} - A copy of the frame chain which was available when the screenshot was created.
   */
  getFrameChain() {
    return new FrameChain(this._logger, this._frameChain);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @override
   * @param {Region} region - The region for which we should get the sub screenshot.
   * @param {boolean} throwIfClipped - Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesWebDriverScreenshot>} - A screenshot instance containing the given region.
   */
  async getSubScreenshot(region, throwIfClipped) {
    this._logger.verbose(`getSubScreenshot([${region}], ${throwIfClipped})`);

    ArgumentGuard.notNull(region, 'region');

    // We calculate intersection based on as-is coordinates.
    const asIsSubScreenshotRegion = this.getIntersectedRegion(region, CoordinatesType.SCREENSHOT_AS_IS);

    if (
      asIsSubScreenshotRegion.isSizeEmpty() ||
      (throwIfClipped && !asIsSubScreenshotRegion.getSize().equals(region.getSize()))
    ) {
      throw new OutOfBoundsError(`Region [${region}] is out of screenshot bounds [${this._frameWindow}]`);
    }

    const subScreenshotImage = await this._image.getImagePart(asIsSubScreenshotRegion);
    const result = await EyesWebDriverScreenshot.fromFrameRegion(
      this._logger,
      this._driver,
      subScreenshotImage,
      new Region(region.getLeft(), region.getRight(), subScreenshotImage.getWidth(), subScreenshotImage.getHeight())
    );

    this._logger.verbose('Done!');
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @override
   * @param {Region} region - The region for which we should get the sub screenshot.
   * @param {boolean} throwIfClipped - Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesWebDriverScreenshot>} - A screenshot instance containing the given region.
   */
  async getSubScreenshotForRegion(region, throwIfClipped) {
    this._logger.verbose(`getSubScreenshotForRegion([${region}], ${throwIfClipped})`);

    ArgumentGuard.notNull(region, 'region');

    // We calculate intersection based on as-is coordinates.
    const asIsSubScreenshotRegion = this.getIntersectedRegion(region, CoordinatesType.SCREENSHOT_AS_IS);

    if (
      asIsSubScreenshotRegion.isEmpty() ||
      (throwIfClipped && !asIsSubScreenshotRegion.getSize().equals(region.getSize()))
    ) {
      throw new OutOfBoundsError(`Region [${region}] is out of screenshot bounds [${this._frameWindow}]`);
    }

    const subScreenshotImage = await this._image.getImagePart(asIsSubScreenshotRegion);
    const result = await EyesWebDriverScreenshot.fromFrameRegion(
      this._logger,
      this._driver,
      subScreenshotImage,
      new Region(region.getLocation(), new RectangleSize(subScreenshotImage.getWidth(), subScreenshotImage.getHeight()))
    );

    this._logger.verbose('Done!');
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
   *
   * @override
   * @param {Location} location - The location which coordinates needs to be converted.
   * @param {CoordinatesType} from - The current coordinates type for {@code location}.
   * @param {CoordinatesType} to - The target coordinates type for {@code location}.
   * @return {Location} - A new location which is the transformation of {@code location} to the {@code to} coordinates
   *   type.
   */
  convertLocation(location, from, to) {
    ArgumentGuard.notNull(location, 'location');
    ArgumentGuard.notNull(from, 'from');
    ArgumentGuard.notNull(to, 'to');

    let result = new Location(location);

    if (from === to) {
      return result;
    }

    // If we're not inside a frame, and the screenshot is the entire page, then the context as-is/relative
    // are the same (notice screenshot as-is might be different, e.g., if it is actually a sub-screenshot of a region).
    if (this._frameChain.size() === 0 && this._screenshotType === ScreenshotType.ENTIRE_FRAME) {
      if (
        (from === CoordinatesType.CONTEXT_RELATIVE || from === CoordinatesType.CONTEXT_AS_IS) &&
        to === CoordinatesType.SCREENSHOT_AS_IS
      ) {
        // If this is not a sub-screenshot, this will have no effect.
        result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());

        // If this is not a region subscreenshot, this will have no effect.
        result = result.offset(-this._regionWindow.getLeft(), -this._regionWindow.getTop());
      } else if (
        from === CoordinatesType.SCREENSHOT_AS_IS &&
        (to === CoordinatesType.CONTEXT_RELATIVE || to === CoordinatesType.CONTEXT_AS_IS)
      ) {
        result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
      }
      return result;
    }

    switch (from) {
      case CoordinatesType.CONTEXT_AS_IS: {
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            result = result.offset(this._currentFrameScrollPosition.getX(), this._currentFrameScrollPosition.getY());
            break;
          case CoordinatesType.SCREENSHOT_AS_IS:
            result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());
            break;
          default:
            throw new CoordinatesTypeConversionError(from, to);
        }
        break;
      }
      case CoordinatesType.CONTEXT_RELATIVE: {
        switch (to) {
          case CoordinatesType.SCREENSHOT_AS_IS:
            // First, convert context-relative to context-as-is.
            result = result.offset(-this._currentFrameScrollPosition.getX(), -this._currentFrameScrollPosition.getY());
            // Now convert context-as-is to screenshot-as-is.
            result = result.offset(this._frameLocationInScreenshot.getX(), this._frameLocationInScreenshot.getY());
            break;
          case CoordinatesType.CONTEXT_AS_IS:
            result = result.offset(-this._currentFrameScrollPosition.getX(), -this._currentFrameScrollPosition.getY());
            break;
          default:
            throw new CoordinatesTypeConversionError(from, to);
        }
        break;
      }
      case CoordinatesType.SCREENSHOT_AS_IS: {
        switch (to) {
          case CoordinatesType.CONTEXT_RELATIVE:
            // First convert to context-as-is.
            result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
            // Now convert to context-relative.
            result = result.offset(this._currentFrameScrollPosition.getX(), this._currentFrameScrollPosition.getY());
            break;
          case CoordinatesType.CONTEXT_AS_IS:
            result = result.offset(-this._frameLocationInScreenshot.getX(), -this._frameLocationInScreenshot.getY());
            break;
          default:
            throw new CoordinatesTypeConversionError(from, to);
        }
        break;
      }
      default: {
        throw new CoordinatesTypeConversionError(from, to);
      }
    }
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * @param {Location} location
   * @param {CoordinatesType} coordinatesType
   * @return {Location}
   */
  getLocationInScreenshot(location, coordinatesType) {
    this._location = this.convertLocation(location, coordinatesType, CoordinatesType.SCREENSHOT_AS_IS);

    // Making sure it's within the screenshot bounds
    if (!this._frameWindow.contains(location)) {
      throw new OutOfBoundsError(`Location ${location} ('${coordinatesType}') is not visible in screenshot!`);
    }
    return this._location;
  }

  /**
   * @override
   * @param {Region} region
   * @param {CoordinatesType} resultCoordinatesType
   * @return {Region}
   */
  getIntersectedRegion(region, resultCoordinatesType) {
    if (region.isEmpty()) {
      return new Region(region);
    }

    const originalCoordinatesType = region.getCoordinatesType();
    let intersectedRegion = this.convertRegionLocation(
      region,
      originalCoordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS
    );

    switch (originalCoordinatesType) {
      // If the request was context based, we intersect with the frame window.
      case CoordinatesType.CONTEXT_AS_IS:
      case CoordinatesType.CONTEXT_RELATIVE:
        intersectedRegion.intersect(this._frameWindow);
        break;
      // If the request is screenshot based, we intersect with the image
      case CoordinatesType.SCREENSHOT_AS_IS:
        intersectedRegion.intersect(new Region(0, 0, this._image.getWidth(), this._image.getHeight()));
        break;
      default:
        throw new CoordinatesTypeConversionError(`Unknown coordinates type: '${originalCoordinatesType}'`);
    }

    // If the intersection is empty we don't want to convert the coordinates.
    if (intersectedRegion.isEmpty()) {
      return intersectedRegion;
    }

    // Converting the result to the required coordinates type.
    intersectedRegion = this.convertRegionLocation(
      intersectedRegion,
      CoordinatesType.SCREENSHOT_AS_IS,
      resultCoordinatesType
    );
    return intersectedRegion;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Gets the elements region in the screenshot.
   *
   * @param {WebElement} element - The element which region we want to intersect.
   * @return {Promise<Region>} - The intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
   */
  async getIntersectedRegionFromElement(element) {
    ArgumentGuard.notNull(element, 'element');

    const rect = await element.getRect();

    // Since the element coordinates are in context relative
    let elementRegion = new Region(rect.x, rect.y, rect.width, rect.height);

    // Since the element coordinates are in context relative
    elementRegion = this.getIntersectedRegion(elementRegion, CoordinatesType.CONTEXT_RELATIVE);

    if (!elementRegion.isEmpty()) {
      elementRegion = this.convertRegionLocation(
        elementRegion,
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS
      );
    }

    return elementRegion;
  }
}

EyesWebDriverScreenshot.ScreenshotType = Object.freeze(ScreenshotType);
exports.EyesWebDriverScreenshot = EyesWebDriverScreenshot;
exports.ScreenshotType = ScreenshotType;
