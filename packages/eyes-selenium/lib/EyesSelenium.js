'use strict';

const {URL} = require('url');
const { DomCapture } = require('@applitools/dom-utils');

const {
  Logger,
  SimplePropertyHandler,
  ReadOnlyPropertyHandler,
  CoordinatesType,
  Region,
  Location,
  RectangleSize,
  UserAgent,
  ArgumentGuard,
  TypeUtils,
} = require('@applitools/eyes-common');

const {
  EyesBase,
  Configuration,
  FullPageCaptureAlgorithm,
  FixedScaleProviderFactory,
  NullScaleProvider,
  RegionProvider,
  NullRegionProvider,
  ContextBasedScaleProviderFactory,
  ScaleProviderIdentityFactory,
  TestFailedError,
  NullCutProvider,
  MatchResult,
} = require('@applitools/eyes-sdk-core');

const { StitchMode } = require('./config/StitchMode');
const { SeleniumConfiguration } = require('./config/SeleniumConfiguration');
const { ImageProviderFactory } = require('./capture/ImageProviderFactory');
const { EyesWebDriverScreenshotFactory } = require('./capture/EyesWebDriverScreenshotFactory');
const { FrameChain } = require('./frames/FrameChain');
const { EyesWebDriver } = require('./wrappers/EyesWebDriver');
const { EyesTargetLocator } = require('./wrappers/EyesTargetLocator');
const { EyesSeleniumUtils } = require('./EyesSeleniumUtils');
const { EyesWebElement } = require('./wrappers/EyesWebElement');
const { EyesWebDriverScreenshot } = require('./capture/EyesWebDriverScreenshot');
const { RegionPositionCompensationFactory } = require('./positioning/RegionPositionCompensationFactory');
const { ImageRotation } = require('./positioning/ImageRotation');
const { ScrollPositionProvider } = require('./positioning/ScrollPositionProvider');
const { CssTranslatePositionProvider } = require('./positioning/CssTranslatePositionProvider');
const { ElementPositionProvider } = require('./positioning/ElementPositionProvider');
const { MoveToRegionVisibilityStrategy } = require('./regionVisibility/MoveToRegionVisibilityStrategy');
const { NopRegionVisibilityStrategy } = require('./regionVisibility/NopRegionVisibilityStrategy');
const { SeleniumJavaScriptExecutor } = require('./SeleniumJavaScriptExecutor');
const { JavascriptHandler } = require('./JavascriptHandler');
const { Target } = require('./fluent/Target');

const VERSION = require('../package.json').version;

/**
 * The main API gateway for the SDK.
 */
class EyesSelenium extends EyesBase {
  /** @var {Logger} EyesSelenium#_logger */
  /** @var {SeleniumConfiguration} EyesSelenium#_configuration */
  /** @var {ImageMatchSettings} EyesSelenium#_defaultMatchSettings */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
   * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   */
  constructor(serverUrl, isDisabled) {
    super(serverUrl, isDisabled, new SeleniumConfiguration());

    /** @type {EyesWebDriver} */
    this._driver = undefined;
    /** @type {boolean} */
    this._dontGetTitle = false;

    /** @type {boolean} */
    this._checkFrameOrElement = false;

    /** @type {Region} */
    this._regionToCheck = null;
    /** @type {Location} */
    this._imageLocation = undefined;

    /** @type {WebElement} */
    this._scrollRootElement = undefined;

    /** @type {ImageRotation} */
    this._rotation = undefined;
    /** @type {number} */
    this._devicePixelRatio = EyesSelenium.UNKNOWN_DEVICE_PIXEL_RATIO;
    /** @type {RegionVisibilityStrategy} */
    this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger);
    /** @type {ElementPositionProvider} */
    this._elementPositionProvider = undefined;
    /** @type {SeleniumJavaScriptExecutor} */
    this._jsExecutor = undefined;
    /** @type {string} */
    this._domUrl = undefined;

    /** @type {UserAgent} */
    this._userAgent = undefined;
    /** @type {ImageProvider} */
    this._imageProvider = undefined;
    /** @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined;

    /** @type {EyesWebElement|WebElement} */
    this._targetElement = null;
    /** @type {PositionMemento} */
    this._positionMemento = null;
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY;
    /** @type {boolean} */
    this._stitchContent = false;
    /** @type {EyesWebDriverScreenshotFactory} */
    this._screenshotFactory = undefined;

    this._init();
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @private
   */
  _init() {
    EyesSeleniumUtils.setJavascriptHandler(new JavascriptHandler());
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @inheritDoc
   */
  getBaseAgentId() {
    return `eyes-selenium/${VERSION}`;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Region}
   */
  getRegionToCheck() {
    return this._regionToCheck;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region} regionToCheck
   */
  setRegionToCheck(regionToCheck) {
    this._regionToCheck = regionToCheck;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  shouldStitchContent() {
    return this._stitchContent;
  }

  /**
   * @return {?EyesWebDriver}
   */
  getDriver() {
    return this._driver;
  }

  /*------------------------- Getters/Setters -------------------------*/

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getHideCaret() {
    return this._configuration.getHideCaret();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} hideCaret
   */
  setHideCaret(hideCaret) {
    this._configuration.setHideCaret(hideCaret);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
   *
   * @param {boolean} shouldForce Whether to force a full page screenshot or not.
   */
  setForceFullPageScreenshot(shouldForce) {
    this._configuration.setForceFullPageScreenshot(shouldForce);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether Eyes should force a full page screenshot.
   */
  getForceFullPageScreenshot() {
    return this._configuration.getForceFullPageScreenshot();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} waitBeforeScreenshots The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   */
  setWaitBeforeScreenshots(waitBeforeScreenshots) {
    this._configuration.setWaitBeforeScreenshots(waitBeforeScreenshots);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} The time to wait just before taking a screenshot.
   */
  getWaitBeforeScreenshots() {
    return this._configuration.getWaitBeforeScreenshots();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} shouldHide Whether to hide the scrollbars or not.
   */
  setHideScrollbars(shouldHide) {
    this._configuration.setHideScrollbars(shouldHide)
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether or not scrollbars are hidden when taking screenshots.
   */
  getHideScrollbars() {
    return this._configuration.getHideScrollbars();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
   * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} mode The stitch mode to set.
   */
  setStitchMode(mode) {
    this._logger.verbose(`setting stitch mode to ${mode}`);

    this._configuration.setStitchMode(mode);
    if (this._driver) {
      this._initPositionProvider();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {StitchMode} The current stitch mode settings.
   */
  getStitchMode() {
    return this._configuration.getStitchMode();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the stitching overlap in pixels.
   *
   * @param {number} stitchOverlap The width (in pixels) of the overlap.
   */
  setStitchOverlap(stitchOverlap) {
    this._configuration.setStitchOverlap(stitchOverlap);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} Returns the stitching overlap in pixels.
   */
  getStitchOverlap() {
    return this._configuration.getStitchOverlap();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Turns on/off the automatic scrolling to a region being checked by {@code checkRegion}.
   *
   * @param {boolean} shouldScroll Whether to automatically scroll to a region being validated.
   */
  setScrollToRegion(shouldScroll) {
    if (shouldScroll) {
      this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger);
    } else {
      this._regionVisibilityStrategy = new NopRegionVisibilityStrategy(this._logger);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} Whether to automatically scroll to a region being validated.
   */
  getScrollToRegion() {
    return !(this._regionVisibilityStrategy instanceof NopRegionVisibilityStrategy);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {WebElement|By} element
   */
  setScrollRootElement(element) {
    this._scrollRootElement = this._driver.findElement(element);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {WebElement}
   */
  getScrollRootElement() {
    return this._scrollRootElement;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {ImageRotation} rotation The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation;
    if (this._driver) {
      this._driver.setRotation(rotation);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageRotation} The image rotation data.
   */
  getRotation() {
    return this._rotation;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if
   *   it wasn't possible to extract it.
   */
  getDevicePixelRatio() {
    return this._devicePixelRatio;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Starts a test.
   *
   * @signature `open(driver, configuration)`
   * @signature `open(driver, appName, testName, ?viewportSize, ?sessionType, ?configuration)`
   *
   * @param {WebDriver|ThenableWebDriver} driver The web driver that controls the browser hosting the application under test.
   * @param {SeleniumConfiguration|string} optArg1 The Configuration for the test or the name of the application under the test.
   * @param {string} [optArg2] The test name.
   * @param {RectangleSize|RectangleSizeObject} [optArg3] The required browser's viewport size
   *   (i.e., the visible part of the document's body) or to use the current window's viewport.
   * @param {SessionType} [optArg4] The type of test (e.g.,  standard test / visual performance test).
   * @param {SeleniumConfiguration} [optArg5] The Configuration for the test
   * @return {Promise<EyesWebDriver>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
   */
  async open(driver, optArg1, optArg2, optArg3, optArg4, optArg5) {
    ArgumentGuard.notNull(driver, 'driver');

    let configuration;
    if (optArg1 instanceof Configuration) {
      configuration = optArg1;
    } else {
      this._configuration.setAppName(optArg1);
      this._configuration.setTestName(optArg2);
      this._configuration.setViewportSize(optArg3);
      this._configuration.setSessionType(optArg4);
      configuration = optArg5;
    }

    if (configuration) {
      this._configuration.mergeConfig(configuration);
    }

    if (this.getIsDisabled()) {
      this._logger.verbose('Ignored');
      return driver;
    }

    if (this._configuration.getStitchMode() === StitchMode.CSS) {
      this.setSendDom(true);
    }

    this._initDriver(driver);

    this._screenshotFactory = new EyesWebDriverScreenshotFactory(this._logger, this._driver);

    const uaString = await this._driver.getUserAgent();
    if (uaString) {
      this._userAgent = UserAgent.parseUserAgentString(uaString, true);
    }

    this._imageProvider = ImageProviderFactory.getImageProvider(this._userAgent, this, this._logger, this._driver);
    this._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(this._userAgent, this, this._logger);

    await super.openBase(this._configuration.getAppName(), this._configuration.getTestName(), this._configuration.getViewportSize(), this._configuration.getSessionType());

    this._devicePixelRatio = EyesSelenium.UNKNOWN_DEVICE_PIXEL_RATIO;
    this._jsExecutor = new SeleniumJavaScriptExecutor(this._driver);

    this._initPositionProvider();

    this._driver.setRotation(this._rotation);
    return this._driver;
  }

  /**
   * @private
   */
  _initDriver(driver) {
    if (driver instanceof EyesWebDriver) {
      // noinspection JSValidateTypes
      this._driver = driver;
    } else {
      this._driver = new EyesWebDriver(this._logger, this, driver);
    }
  }

  /**
   * @private
   */
  _initPositionProvider() {
    // Setting the correct position provider.
    const stitchMode = this.getStitchMode();
    this._logger.verbose(`initializing position provider. stitchMode: ${stitchMode}`);
    switch (stitchMode) {
      case StitchMode.CSS:
        this._positionProviderHandler.set(new CssTranslatePositionProvider(this._logger, this._jsExecutor));
        break;
      default:
        this._positionProviderHandler.set(new ScrollPositionProvider(this._logger, this._jsExecutor));
    }
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * Perform visual validation
   *
   * @param {string} name A name to be associated with the match
   * @param {SeleniumCheckSettings} checkSettings Target instance which describes whether we want a
   *   window/region/frame
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    } else {
      name = checkSettings.getName();
    }

    if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
      this._logger.verbose(`URL: ${await this._driver.getCurrentUrl()}`);
    }

    this._logger.verbose(`check(${checkSettings}) - begin`);
    this._stitchContent = checkSettings.getStitchContent();
    const targetRegion = checkSettings.getTargetRegion();

    this._originalFC = new FrameChain(this._logger, this._driver.getFrameChain());

    const switchedToFrameCount = await this._switchToFrame(checkSettings);

    this._scrollRootElement = null;
    this._regionToCheck = null;
    this._imageLocation = null;

    let result = null;

    const switchTo = this._driver.switchTo();
    let originalFC = null;

    if (targetRegion) {
      originalFC = await this._tryHideScrollbars();
      this._imageLocation = targetRegion.getLocation();
      result = await super.checkWindowBase(new RegionProvider(targetRegion), name, false, checkSettings);
    } else if (checkSettings) {
      let targetElement = checkSettings.getTargetElement();

      const targetSelector = checkSettings.getTargetSelector();
      if (!targetElement && targetSelector) {
        targetElement = await this._driver.findElement(targetSelector);
      }

      if (targetElement) {
        originalFC = await this._tryHideScrollbars();
        this._targetElement = targetElement instanceof EyesWebElement ? targetElement :
          new EyesWebElement(this._logger, this._driver, targetElement);
        if (this._stitchContent) {
          result = await this._checkElement(undefined, name, checkSettings);
        } else {
          result = await this._checkRegionByElement(name, checkSettings);
        }
        this._targetElement = null;
      } else if (checkSettings.getFrameChain().length > 0) {
        originalFC = await this._tryHideScrollbars();
        if (this._stitchContent) {
          result = await this._checkFullFrameOrElement(name, checkSettings);
        } else {
          result = await this._checkFrameFluent(name, checkSettings);
        }
      } else {
        if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
          // required to prevent cut line on the last stitched part of the page on some browsers (like firefox).
          await switchTo.defaultContent();
          originalFC = await this._tryHideScrollbars();
        }
        result = await super.checkWindowBase(new NullRegionProvider(), name, false, checkSettings);
      }
    }

    if (!result) {
      result = new MatchResult();
    }

    await this._switchToParentFrame(switchedToFrameCount);

    if (this._positionMemento != null) {
      await this._positionProviderHandler.get().restoreState(this._positionMemento);
      this._positionMemento = null;
    }

    await switchTo.resetScroll();

    if (originalFC) {
      await this._tryRestoreScrollbars(originalFC);
    }

    await this._trySwitchToFrames(this._driver, switchTo, this._originalFC);

    this._stitchContent = false;
    this._imageLocation = null;

    this._logger.verbose('check - done!');
    return result;
  }

  /**
   * @private
   * @param driver
   * @param switchTo
   * @param frames
   * @return {Promise<void>}
   */
  async _trySwitchToFrames(driver, switchTo, frames) {
    if (await EyesSeleniumUtils.isMobileDevice(driver)) {
      return;
    }

    try {
      await switchTo.frames(frames);
    } catch (err) {
      this._logger.log(`WARNING: Failed to switch to original frame chain! ${err}`);
    }
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkFrameFluent(name, checkSettings) {
    const frameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const targetFrame = frameChain.pop();
    this._targetElement = targetFrame.getReference();

    await this._driver.switchTo().framesDoScroll(frameChain);
    const result = await this._checkRegionByElement(name, checkSettings);
    this._targetElement = null;
    return result;
  }

  /**
   * @private
   * @return {Promise<number>}
   */
  async _switchToParentFrame(switchedToFrameCount) {
    if (switchedToFrameCount > 0) {
      await this._driver.switchTo().parentFrame();
      return this._switchToParentFrame(switchedToFrameCount - 1);
    }

    return switchedToFrameCount;
  }

  /**
   * @private
   * @param {SeleniumCheckSettings} checkSettings
   * @return {Promise<number>}
   */
  async _switchToFrame(checkSettings) {
    if (!checkSettings) {
      return 0;
    }

    const frameChain = checkSettings.getFrameChain();

    let switchedToFrameCount = 0;
    for (const frameLocator of frameChain) {
      const b = await this._switchToFrameLocator(frameLocator);
      if (b) {
        switchedToFrameCount += 1;
      }
    }
    return switchedToFrameCount;
  }

  /**
   * @private
   * @return {Promise<boolean>}
   */
  async _switchToFrameLocator(frameLocator) {
    const switchTo = this._driver.switchTo();

    if (frameLocator.getFrameIndex()) {
      await switchTo.frame(frameLocator.getFrameIndex());
      return true;
    }

    if (frameLocator.getFrameNameOrId()) {
      await switchTo.frame(frameLocator.getFrameNameOrId());
      return true;
    }

    if (frameLocator.getFrameElement()) {
      const frameElement = frameLocator.getFrameElement();
      if (frameElement) {
        await switchTo.frame(frameElement);
        return true;
      }
    }

    if (frameLocator.getFrameSelector()) {
      const frameElement = this._driver.findElement(frameLocator.getFrameSelector());
      if (frameElement) {
        await switchTo.frame(frameElement);
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkFullFrameOrElement(name, checkSettings) {
    this._checkFrameOrElement = true;
    this._logger.verbose('checkFullFrameOrElement()');

    const self = this;
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /**
       * @inheritDoc
       */
      async getRegion() {
        const region = await self._getFullFrameOrElementRegion();
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const result = await super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings);
    this._checkFrameOrElement = false;
    return result;
  }

  /**
   * @private
   * @return {Promise<Region>}
   */
  async _getFullFrameOrElementRegion() {
    if (this._checkFrameOrElement) {
      const fc = await this._ensureFrameVisible();

      // FIXME - Scaling should be handled in a single place instead
      const scaleProviderFactory = await this._updateScalingParams();

      const screenshotImage = await this._imageProvider.getImage();

      await this._debugScreenshotsProvider.save(screenshotImage, 'checkFullFrameOrElement');

      scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());

      const switchTo = this._driver.switchTo();
      await switchTo.frames(fc);

      const screenshot = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, screenshotImage);
      this._logger.verbose('replacing regionToCheck');
      this.setRegionToCheck(screenshot.getFrameWindow());
    }

    return Region.EMPTY;
  }

  /**
   * @private
   * @return {Promise<FrameChain>}
   */
  async _ensureFrameVisible() {
    const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
    const fc = new FrameChain(this._logger, this._driver.getFrameChain());
    while (fc.size() > 0) {
      // driver.getRemoteWebDriver().switchTo().parentFrame();
      const frame = fc.pop();
      await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
      if (fc.size() === 0) {
        this._positionMemento = await this._positionProviderHandler.get().getState();
      }
      await this._positionProviderHandler.get().setPosition(frame.getLocation());

      const reg = new Region(Location.ZERO, frame.getInnerSize());
      this._effectiveViewport.intersect(reg);
    }
    await this._driver.switchTo().frames(originalFC);
    return originalFC;
  }

  /**
   * @private
   * @param {WebElement} element
   * @return {Promise<void>}
   */
  async _ensureElementVisible(element) {
    if (this._targetElement == null || !this.getScrollToRegion()) {
      // No element? we must be checking the window.
      return;
    }

    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      this._logger.log("NATIVE context identified, skipping 'ensure element visible'");
      return;
    }

    const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    const eyesWebElement = new EyesWebElement(this._logger, this._driver, element);
    let elementBounds = await eyesWebElement.getBounds();

    const currentFrameOffset = originalFC.getCurrentFrameOffset();
    elementBounds = elementBounds.offset(currentFrameOffset.getX(), currentFrameOffset.getY());

    const viewportBounds = await this._getViewportScrollBounds();

    if (!viewportBounds.contains(elementBounds)) {
      await this._ensureFrameVisible();

      const rect = await eyesWebElement.getRect();
      const elementLocation = new Location(rect);

      // const isEquals = await EyesWebElement.equals(element, originalFC.peek());
      if (originalFC.size() > 0) {
        await switchTo.frames(originalFC);
      }

      await this._positionProviderHandler.get().setPosition(elementLocation);
    }
  }

  /**
   * @private
   * @return {Promise<Region>}
   */
  async _getViewportScrollBounds() {
    if (!this.getScrollToRegion()) {
      return Region.EMPTY;
    }

    const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    await switchTo.defaultContent();
    const spp = new ScrollPositionProvider(this._logger, this._jsExecutor);
    let location = null;
    try {
      location = await spp.getCurrentPosition();
    } catch (err) {
      this._logger.log(`WARNING: ${err}`);
      this._logger.log('Assuming position is 0,0');
      location = new Location(Location.ZERO);
    }

    const size = await this.getViewportSize();
    const viewportBounds = new Region(location, size);
    await switchTo.frames(originalFrameChain);
    return viewportBounds;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkRegionByElement(name, checkSettings) {
    const self = this;

    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /** @inheritDoc */
      async getRegion() {
        const rect = await self._targetElement.getRect();
        const region = new Region(Math.ceil(rect.x), Math.ceil(rect.y), rect.width, rect.height, CoordinatesType.CONTEXT_RELATIVE);
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const result = await super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings);
    this._logger.verbose('Done! trying to scroll back to original position..');
    return result;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkElement(eyesElement = this._targetElement, name, checkSettings) {
    this._regionToCheck = null;
    const originalPositionMemento = await this._positionProviderHandler.get().getState();

    await this._ensureElementVisible(this._targetElement);

    const originalPositionProvider = this._positionProviderHandler.get();
    const scrollPositionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor);
    const originalScrollPosition = await scrollPositionProvider.getCurrentPosition();

    let result;
    let originalOverflow;
    const rect = await eyesElement.getRect();

    try {
      this._checkFrameOrElement = true;

      const displayStyle = await eyesElement.getComputedStyle('display');
      if (displayStyle !== 'inline') {
        this._elementPositionProvider = new ElementPositionProvider(this._logger, this._driver, eyesElement);
      } else {
        this._elementPositionProvider = null;
      }

      if (this._configuration.getHideScrollbars()) {
        originalOverflow = await eyesElement.getOverflow();
        await eyesElement.setOverflow('hidden');
      }

      const borderLeftWidth = await eyesElement.getComputedStyleInteger('border-left-width');
      const borderTopWidth = await eyesElement.getComputedStyleInteger('border-top-width');

      const elementWidth = await eyesElement.getClientWidth();
      const elementHeight = await eyesElement.getClientHeight();

      const elementRegion = new Region(
        rect.x + borderLeftWidth,
        rect.y + borderTopWidth,
        elementWidth,
        elementHeight,
        CoordinatesType.SCREENSHOT_AS_IS
      );

      this._logger.verbose(`Element region: ${elementRegion}`);

      this._logger.verbose('replacing regionToCheck');
      this._regionToCheck = elementRegion;

      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport);
      }

      this._imageLocation = this._regionToCheck.getLocation();
      result = await super.checkWindowBase(new NullRegionProvider(), name, false, checkSettings);
    } finally {
      if (originalOverflow) {
        await eyesElement.setOverflow(originalOverflow);
      }

      this._checkFrameOrElement = false;

      await originalPositionProvider.restoreState(originalPositionMemento);
      await scrollPositionProvider.setPosition(originalScrollPosition);
      this._positionProviderHandler.set(originalPositionProvider);
      this._regionToCheck = null;
      this._imageLocation = null;
      this._elementPositionProvider = null;
    }

    return result;
  }

  /**
   * Updates the state of scaling related parameters.
   *
   * @protected
   * @return {Promise<ScaleProviderFactory>}
   */
  async _updateScalingParams() {
    // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
    if (
      this._devicePixelRatio === EyesSelenium.UNKNOWN_DEVICE_PIXEL_RATIO &&
      this._scaleProviderHandler.get() instanceof NullScaleProvider
    ) {
      let factory;
      this._logger.verbose('Trying to extract device pixel ratio...');

      try {
        this._devicePixelRatio = await EyesSeleniumUtils.getDevicePixelRatio(this._jsExecutor);
      } catch (err) {
        this._logger.verbose('Failed to extract device pixel ratio! Using default.', err);
        this._devicePixelRatio = EyesSelenium.DEFAULT_DEVICE_PIXEL_RATIO;
      }
      this._logger.verbose(`Device pixel ratio: ${this._devicePixelRatio}`);

      this._logger.verbose('Setting scale provider...');
      try {
        factory = await this._getScaleProviderFactory();
      } catch (err) {
        this._logger.verbose('Failed to set ContextBasedScaleProvider.', err);
        this._logger.verbose('Using FixedScaleProvider instead...');
        factory = new FixedScaleProviderFactory(1 / this._devicePixelRatio, this._scaleProviderHandler);
      }

      this._logger.verbose('Done!');
      return factory;
    }

    // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
    const nullProvider = new SimplePropertyHandler();
    return new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider);
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const entireSize = await this._positionProviderHandler.get().getEntireSize();

    return new ContextBasedScaleProviderFactory(
      this._logger,
      entireSize,
      this._viewportSizeHandler.get(),
      this._devicePixelRatio,
      false,
      this._scaleProviderHandler
    );
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @param {string} [tag] An optional tag to be associated with the snapshot.
   * @param {number} [matchTimeout] The amount of time to retry matching (Milliseconds).
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkWindow(tag, matchTimeout) {
    return this.check(tag, Target.window().timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   *
   * @param {number|string|By|WebElement|EyesWebElement} element The element which is the frame to switch to.
   * @param {number} [matchTimeout] The amount of time to retry matching (milliseconds).
   * @param {string} [tag] An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkFrame(element, matchTimeout, tag) {
    return this.check(tag, Target.frame(element).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   *
   * @param {WebElement|EyesWebElement} element The element to check.
   * @param {?number} [matchTimeout] The amount of time to retry matching (milliseconds).
   * @param {string} [tag] An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkElement(element, matchTimeout, tag) {
    return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   *
   * @param {By} locator The element to check.
   * @param {?number} [matchTimeout] The amount of time to retry matching (milliseconds).
   * @param {string} [tag] An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkElementBy(locator, matchTimeout, tag) {
    return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {Region} region The region to validate (in screenshot coordinates).
   * @param {string} [tag] An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] The amount of time to retry matching.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkRegion(region, tag, matchTimeout) {
    return this.check(tag, Target.region(region).timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {WebElement|EyesWebElement} element The element defining the region to validate.
   * @param {string} [tag] An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] The amount of time to retry matching.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkRegionByElement(element, tag, matchTimeout) {
    return this.check(tag, Target.region(element).timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {By} by The WebDriver selector used for finding the region to validate.
   * @param {string} [tag] An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] The amount of time to retry matching.
   * @param {boolean} [stitchContent] If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkRegionBy(by, tag, matchTimeout, stitchContent) {
    return this.check(tag, Target.region(by).timeout(matchTimeout).stitchContent(stitchContent));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by
   * the given selector.
   *
   * @param {string} frameNameOrId The name or id of the frame to switch to. (as would be used in a call to
   *   driver.switchTo().frame()).
   * @param {By} locator A Selector specifying the region to check.
   * @param {?number} [matchTimeout] The amount of time to retry matching. (Milliseconds)
   * @param {string} [tag] An optional tag to be associated with the snapshot.
   * @param {boolean} [stitchContent] If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} A promise which is resolved when the validation is finished.
   */
  async checkRegionInFrame(frameNameOrId, locator, matchTimeout, tag, stitchContent) {
    return this.check(tag, Target.region(locator, frameNameOrId).timeout(matchTimeout).stitchContent(stitchContent));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {Location} cursor  The cursor's position relative to the control.
   */
  addMouseTrigger(action, control, cursor) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`);
      return;
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`);
      return;
    }

    if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
      this._logger.verbose(`Ignoring ${action} (different frame)`);
      return;
    }

    super.addMouseTriggerBase(action, control, cursor);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {EyesWebElement} element The WebElement on which the click was called.
   * @return {Promise<void>}
   */
  async addMouseTriggerForElement(action, element) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`);
      return;
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`);
      return;
    }

    if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
      this._logger.verbose(`Ignoring ${action} (different frame)`);
      return;
    }

    ArgumentGuard.notNull(element, 'element');

    const rect = await element.getRect();
    const elementRegion = new Region(rect.x, rect.y, rect.width, rect.height);

    super.addMouseTriggerBase(action, elementRegion, elementRegion.getMiddleOffset());
  }

  /**
   * Adds a keyboard trigger.
   *
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {string} text  The trigger's text.
   */
  addTextTrigger(control, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`);
      return;
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`);
      return;
    }

    if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
      this._logger.verbose(`Ignoring ${text} (different frame)`);
      return;
    }

    super.addTextTriggerBase(control, text);
  }

  /**
   * Adds a keyboard trigger.
   *
   * @param {EyesWebElement} element The element for which we sent keys.
   * @param {string} text  The trigger's text.
   * @return {Promise<void>}
   */
  async addTextTriggerForElement(element, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`);
      return;
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`);
      return;
    }

    if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
      this._logger.verbose(`Ignoring ${text} (different frame)`);
      return;
    }

    ArgumentGuard.notNull(element, 'element');

    const rect = element.getRect();
    const elementRegion = new Region(Math.ceil(rect.x), Math.ceil(rect.y), rect.width, rect.height);

    super.addTextTrigger(elementRegion, text);
  }

  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, string, string)} or one of its
   * variants.
   *
   * @inheritDoc
   */
  async getViewportSize() {
    let viewportSize = this._viewportSizeHandler.get();
    if (!viewportSize) {
      viewportSize = await this._driver.getDefaultContentViewportSize();
    }

    return viewportSize;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, string, string)} or one of its
   * variants.
   *
   * @protected
   * @inheritDoc
   */
  async setViewportSize(viewportSize) {
    if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
      this._logger.verbose('Ignored (viewport size given explicitly)');
      return;
    }

    ArgumentGuard.notNull(viewportSize, 'viewportSize');
    viewportSize = new RectangleSize(viewportSize);

    const originalFrame = this._driver.getFrameChain();
    await this._driver.switchTo().defaultContent();

    try {
      await EyesSeleniumUtils.setViewportSize(this._logger, this._driver, viewportSize);
      this._effectiveViewport = new Region(Location.ZERO, viewportSize);
    } catch (err) {
      await this._driver.switchTo().frames(originalFrame); // Just in case the user catches that error
      throw new TestFailedError('Failed to set the viewport size', err);
    }

    await this._driver.switchTo().frames(originalFrame);
    this._viewportSizeHandler.set(new RectangleSize(viewportSize));
  }

  // noinspection JSUnusedGlobalSymbols, JSCheckFunctionSignatures
  /**
   * Call this method if for some reason you don't want to call {@link #open(WebDriver, string, string)} (or one of its
   * variants) yet.
   *
   * @param {EyesWebDriver} driver The driver to use for getting the viewport.
   * @return {Promise<RectangleSize>} The viewport size of the current context.
   */
  static async getViewportSize(driver) {
    ArgumentGuard.notNull(driver, 'driver');
    return EyesSeleniumUtils.getViewportSizeOrDisplaySize(new Logger(), driver);
  }

  // noinspection JSUnusedGlobalSymbols, JSCheckFunctionSignatures
  /**
   * Set the viewport size using the driver. Call this method if for some reason you don't want to call
   * {@link #open(WebDriver, string, string)} (or one of its variants) yet.
   *
   * @param {EyesWebDriver} driver The driver to use for setting the viewport.
   * @param {RectangleSize} viewportSize The required viewport size.
   * @return {Promise<void>}
   */
  static async setViewportSize(driver, viewportSize) {
    ArgumentGuard.notNull(driver, 'driver');
    ArgumentGuard.notNull(viewportSize, 'viewportSize');

    await EyesSeleniumUtils.setViewportSize(new Logger(), driver, new RectangleSize(viewportSize));
  }

  /**
   * @inheritDoc
   */
  async beforeOpen() {
    this._scrollRootElement = null;
    await this._tryHideScrollbars();
  }

  /**
   * @inheritDoc
   */
  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...');
      return await DomCapture.getFullWindowDom(this._logger, this.getDriver());
    } catch (err) {
      this._logger.log(`Error capturing DOM of the page: ${err}`);
      return '';
    }
  }

  /**
   * @inheritDoc
   */
  async getOrigin() {
    const currentUrl = await this.getDriver().getCurrentUrl();
    return new URL(currentUrl).origin;
  }

  /**
   * @inheritDoc
   */
  getDomUrl() {
    return Promise.resolve(this._domUrl);
  }

  /**
   * @inheritDoc
   */
  setDomUrl(domUrl) {
    this._domUrl = domUrl;
  }

  /**
   * @private
   * @return {Promise<FrameChain>}
   */
  async _tryHideScrollbars() {
    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      return new FrameChain(this._logger);
    }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
      const fc = new FrameChain(this._logger, this._driver.getFrameChain());
      while (fc.size() > 0) {
        if (this._stitchContent || fc.size() !== originalFC.size()) {
          await EyesSeleniumUtils.hideScrollbars(this._driver, 200, this._scrollRootElement);
        }
        fc.pop();
        await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
      }

      // this._originalOverflow = await EyesSeleniumUtils.hideScrollbars(this._driver, 200, this._scrollRootElement);
      await this._driver.switchTo().frames(originalFC);
      return originalFC;
    }

    return new FrameChain(this._logger);
  }

  /**
   * @inheritDoc
   */
  async getImageLocation() {
    if (this._imageLocation) {
      return this._imageLocation;
    }

    return Location.ZERO;
  }

  /**
   * @private
   * @param {FrameChain} frameChain
   * @return {Promise<void>}
   */
  async _tryRestoreScrollbars(frameChain) {
    if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
      return;
    }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      await this._driver.switchTo().frames(frameChain);
      const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
      const fc = new FrameChain(this._logger, this._driver.getFrameChain());
      await this._tryRestoreScrollbarsLoop(fc);
      await this._driver.switchTo().frames(originalFC);
    }
    this._driver.getFrameChain().clear();
  }

  /**
   * @private
   * @param {FrameChain} fc
   * @return {Promise<void>}
   */
  async _tryRestoreScrollbarsLoop(fc) {
    if (fc.size() > 0) {
      await this._driver.switchTo().parentFrame();

      const frame = fc.pop();
      let frameReference = frame.getReference();
      frameReference = frameReference instanceof EyesWebElement ? frameReference : new EyesWebElement(this._logger, this._driver, frameReference);
      await frameReference.setOverflow(frame.getOriginalOverflow());

      await this._tryRestoreScrollbarsLoop(fc);
    }
  }

  /*
  /**
   * @protected
   * @return {Promise<void>}
   * /
  _afterMatchWindow() {
    if (this.hideScrollbars) {
      try {
        EyesSeleniumUtils.setOverflow(this.driver, this.originalOverflow);
      } catch (EyesDriverOperationException e) {
        // Bummer, but we'll continue with the screenshot anyway :)
        logger.log("WARNING: Failed to revert overflow! Error: " + e.getMessage());
      }
    }
  }
  */

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @inheritDoc
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()');

    const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain());
    const switchTo = this._driver.switchTo();

    const scaleProviderFactory = await this._updateScalingParams();
    const fullPageCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      new ScrollPositionProvider(this._logger, this._jsExecutor),
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider
    );

    let activeElement = null;
    if (this._configuration.getHideCaret()) {
      try {
        activeElement = await this._driver.executeScript('var activeElement = document.activeElement; activeElement && activeElement.blur(); return activeElement;');
      } catch (err) {
        this._logger.verbose(`WARNING: Cannot hide caret! ${err}`);
      }
    }

    let result;
    if (this._checkFrameOrElement) {
      this._logger.verbose('Check frame/element requested');

      await switchTo.frames(originalFrameChain);

      const entireFrameOrElement = await fullPageCapture.getStitchedRegion(this._regionToCheck, null, this.getElementPositionProvider());

      this._logger.verbose('Building screenshot object...');
      const size = new RectangleSize(entireFrameOrElement.getWidth(), entireFrameOrElement.getHeight());
      result = await EyesWebDriverScreenshot.fromFrameSize(this._logger, this._driver, entireFrameOrElement, size);
    } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
      this._logger.verbose('Full page screenshot requested.');

      // Save the current frame path.
      const originalFramePosition = originalFrameChain.size() > 0 ?
        originalFrameChain.getDefaultContentScrollPosition() : new Location(Location.ZERO);

      await switchTo.defaultContent();

      const fullPageImage = await fullPageCapture.getStitchedRegion(Region.EMPTY, null, this._positionProviderHandler.get());

      await switchTo.frames(originalFrameChain);
      result = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, fullPageImage, null, originalFramePosition);
    } else {
      await this._ensureElementVisible(this._targetElement);

      this._logger.verbose('Screenshot requested...');
      let screenshotImage = await this._imageProvider.getImage();
      await this._debugScreenshotsProvider.save(screenshotImage, 'original');

      const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
      if (scaleProvider.getScaleRatio() !== 1) {
        this._logger.verbose('scaling...');
        screenshotImage = await screenshotImage.scale(scaleProvider.getScaleRatio());
        await this._debugScreenshotsProvider.save(screenshotImage, 'scaled');
      }

      const cutProvider = this._cutProviderHandler.get();
      if (!(cutProvider instanceof NullCutProvider)) {
        this._logger.verbose('cutting...');
        screenshotImage = await cutProvider.cut(screenshotImage);
        await this._debugScreenshotsProvider.save(screenshotImage, 'cut');
      }

      this._logger.verbose('Creating screenshot object...');
      result = await EyesWebDriverScreenshot.fromScreenshotType(this._logger, this._driver, screenshotImage);
    }

    if (this._configuration.getHideCaret() && activeElement != null) {
      try {
        await this._driver.executeScript('arguments[0].focus();', activeElement);
      } catch (err) {
        this._logger.verbose(`WARNING: Could not return focus to active element! ${err}`);
      }
    }

    this._logger.verbose('Done!');
    return result;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @inheritDoc
   */
  async getTitle() {
    if (!this._dontGetTitle) {
      try {
        return await this._driver.getTitle();
      } catch (err) {
        this._logger.verbose(`failed (${err})`);
        this._dontGetTitle = true;
      }
    }

    return '';
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @inheritDoc
   */
  async getInferredEnvironment() {
    try {
      const userAgent = await this._driver.getUserAgent();
      return `useragent:${userAgent}`;
    } catch (ignored) {
      return undefined;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the image rotation degrees.
   * @param {number} degrees The amount of degrees to set the rotation to.
   * @deprecated use {@link setRotation} instead
   */
  setForcedImageRotation(degrees) {
    this.setRotation(new ImageRotation(degrees));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get the rotation degrees.
   * @return {number} The rotation degrees.
   * @deprecated use {@link getRotation} instead
   */
  getForcedImageRotation() {
    return this.getRotation().getRotation();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get the session id.
   * @return {Promise<string>} A promise which resolves to the webdriver's session ID.
   */
  async getAUTSessionId() {
    if (!this._driver) {
      return undefined;
    }

    return this._driver.getSessionId();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {PositionProvider} The currently set position provider.
   */
  getElementPositionProvider() {
    return this._elementPositionProvider ? this._elementPositionProvider : this._positionProviderHandler.get();
  }
}

EyesSelenium.UNKNOWN_DEVICE_PIXEL_RATIO = 0;
EyesSelenium.DEFAULT_DEVICE_PIXEL_RATIO = 1;
exports.EyesSelenium = EyesSelenium;
