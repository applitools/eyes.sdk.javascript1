'use strict';

const { By } = require('selenium-webdriver');
const { DomCapture } = require('@applitools/dom-utils');

const {
  SimplePropertyHandler,
  CoordinatesType,
  Region,
  Location,
  RectangleSize,
  UserAgent,
  ArgumentGuard,
  TypeUtils,
} = require('@applitools/eyes-common');

const {
  FullPageCaptureAlgorithm,
  FixedScaleProviderFactory,
  NullScaleProvider,
  RegionProvider,
  NullRegionProvider,
  ContextBasedScaleProviderFactory,
  ScaleProviderIdentityFactory,
  NullCutProvider,
  MatchResult,
} = require('@applitools/eyes-sdk-core');

const { ClassicRunner } = require('./runner/ClassicRunner');
const { StitchMode } = require('./config/StitchMode');
const { ImageProviderFactory } = require('./capture/ImageProviderFactory');
const { EyesWebDriverScreenshotFactory } = require('./capture/EyesWebDriverScreenshotFactory');
const { FrameChain } = require('./frames/FrameChain');
const { EyesTargetLocator } = require('./wrappers/EyesTargetLocator');
const { EyesSeleniumUtils } = require('./EyesSeleniumUtils');
const { EyesWebElement } = require('./wrappers/EyesWebElement');
const { EyesWebDriverScreenshot } = require('./capture/EyesWebDriverScreenshot');
const { RegionPositionCompensationFactory } = require('./positioning/RegionPositionCompensationFactory');
const { ScrollPositionProvider } = require('./positioning/ScrollPositionProvider');
const { ElementPositionProvider } = require('./positioning/ElementPositionProvider');
const { CssTranslatePositionProvider } = require('./positioning/CssTranslatePositionProvider');
const { Eyes } = require('./Eyes');

/**
 * The main API gateway for the SDK.
 *
 * @ignore
 */
class EyesSelenium extends Eyes {
  /** @var {Logger} EyesSelenium#_logger */
  /** @var {Configuration} EyesSelenium#_configuration */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @param {ClassicRunner} [runner] - Set shared ClassicRunner if you want to group results.
   */
  constructor(serverUrl, isDisabled, runner = new ClassicRunner()) {
    super(serverUrl, isDisabled, runner);

    /** @type {boolean} */
    this._checkFrameOrElement = false;

    /** @type {Location} */
    this._imageLocation = undefined;

    /** @type {UserAgent} */
    this._userAgent = undefined;
    /** @type {ImageProvider} */
    this._imageProvider = undefined;
    /** @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined;

    /** @type {EyesWebElement|WebElement} */
    this._targetElement = undefined;
    /** @type {PositionMemento} */
    this._positionMemento = undefined;
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY;
    /** @type {EyesWebDriverScreenshotFactory} */
    this._screenshotFactory = undefined;
  }

  /**
   * @inheritDoc
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver');

    // noinspection NonBlockStatementBodyJS
    if (appName) this._configuration.setAppName(appName);
    // noinspection NonBlockStatementBodyJS
    if (testName) this._configuration.setTestName(testName);
    // noinspection NonBlockStatementBodyJS
    if (viewportSize) this._configuration.setViewportSize(viewportSize);
    // noinspection NonBlockStatementBodyJS
    if (sessionType) this._configuration.setSessionType(sessionType);

    ArgumentGuard.notNull(this._configuration.getAppName(), 'appName');
    ArgumentGuard.notNull(this._configuration.getTestName(), 'testName');

    if (this.getIsDisabled()) {
      this._logger.verbose('Ignored');
      return driver;
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

    this._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;

    this._driver.setRotation(this._rotation);
    return this._driver;
  }

  /**
   * @private
   * @return {PositionProvider}
   */
  _createPositionProvider(scrollRootElement = this._scrollRootElement) {
    // Setting the correct position provider.
    this._logger.verbose('initializing position provider. stitchMode:', this._configuration.getStitchMode());

    switch (this._configuration.getStitchMode()) {
      case StitchMode.CSS:
        return new CssTranslatePositionProvider(this._logger, this._jsExecutor, scrollRootElement);
      default:
        return new ScrollPositionProvider(this._logger, this._jsExecutor, scrollRootElement);
    }
  }

  /**
   * Perform visual validation
   *
   * @param {string} name - A name to be associated with the match
   * @param {SeleniumCheckSettings} checkSettings - Target instance which describes whether we want a window/region/frame
   * @return {Promise<TestResults>} - A promise which is resolved when the validation is finished.
   */
  async testWindow(name, checkSettings) {
    const originalCheckWindowBase = this.checkWindowBase;
    try {
      this.checkWindowBase = this.checkSingleWindowBase;

      return await this.check(name, checkSettings);
    } finally {
      this.checkWindowBase = originalCheckWindowBase;
    }
  }

  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @inheritDoc
   */
  async check(name, checkSettings) {
    if (this._configuration.getIsDisabled()) {
      this._logger.log(`check('${name}', ${checkSettings}): Ignored`);
      return new MatchResult();
    }

    ArgumentGuard.notNull(checkSettings, 'checkSettings');
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    } else {
      name = checkSettings.getName();
    }

    this._logger.verbose(`check(${checkSettings}) - begin`);
    this._stitchContent = checkSettings.getStitchContent();
    const targetRegion = checkSettings.getTargetRegion();
    this._scrollRootElement = await this._getScrollRootElementFromCheckSettings(checkSettings);

    this._currentFramePositionProvider = null;
    this.setPositionProvider(this._createPositionProvider());
    this._originalFC = this._driver.getFrameChain().clone();

    // const validationInfo = this.fireValidationWillStartEvent(name);

    // if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
    this._logger.verbose(`URL: ${await this._driver.getCurrentUrl()}`);
    // }

    const switchedToFrameCount = await this._switchToFrame(checkSettings);

    this._regionToCheck = null;

    let result = null;

    const switchTo = this._driver.switchTo();
    let originalFC = null;

    if (targetRegion) {
      this._logger.verbose('have target region');
      originalFC = await this._tryHideScrollbars();
      this._imageLocation = targetRegion.getLocation();
      const source = await this._driver.getCurrentUrl();
      result = await this.checkWindowBase(new RegionProvider(targetRegion), name, false, checkSettings, source);
    } else if (checkSettings) {
      let targetElement = checkSettings.getTargetElement();

      const targetSelector = checkSettings.getTargetSelector();
      if (!targetElement && targetSelector) {
        targetElement = this._driver.findElement(targetSelector);
      }

      if (targetElement) {
        this._logger.verbose('have target element');
        originalFC = await this._tryHideScrollbars();
        this._targetElement = new EyesWebElement(this._logger, this._driver, targetElement);
        if (this._stitchContent) {
          result = await this._checkElement(undefined, name, checkSettings);
        } else {
          result = await this._checkRegionByElement(name, checkSettings);
        }
        this._targetElement = null;
      } else if (checkSettings.getFrameChain().length > 0) {
        this._logger.verbose('have frame chain');
        originalFC = await this._tryHideScrollbars();
        if (this._stitchContent) {
          result = await this._checkFullFrameOrElement(name, checkSettings);
        } else {
          result = await this._checkFrameFluent(name, checkSettings);
        }
      } else {
        this._logger.verbose('default case');
        // if (!(await EyesSeleniumUtils.isMobileDevice(this._driver))) {
        // required to prevent cut line on the last stitched part of the page on some browsers (like firefox).
        await switchTo.defaultContent();
        originalFC = await this._tryHideScrollbars();
        const scrollRootElement = await this.getScrollRootElement();
        this._currentFramePositionProvider = this._createPositionProvider(scrollRootElement);
        // }
        const source = await this._driver.getCurrentUrl();
        result = await this.checkWindowBase(new NullRegionProvider(), name, false, checkSettings, source);
        await switchTo.frames(this._originalFC);
      }
    }

    if (!result) {
      result = new MatchResult();
    }

    await this._switchToParentFrame(switchedToFrameCount);

    if (this._positionMemento) {
      await this._positionProviderHandler.get().restoreState(this._positionMemento);
      this._positionMemento = null;
    }

    await switchTo.resetScroll();

    if (originalFC) {
      await this._tryRestoreScrollbars(originalFC);
    }

    await this._trySwitchToFrames(switchTo, this._originalFC);

    this._stitchContent = false;
    this._imageLocation = null;

    this._logger.verbose('check - done!');
    return result;
  }

  /**
   * @private
   * @param {EyesTargetLocator} switchTo
   * @param {FrameChain} frames
   * @return {Promise}
   */
  async _trySwitchToFrames(switchTo, frames) {
    // if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
    //   return;
    // }

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
    const frameChain = this._driver.getFrameChain().clone();
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
      if (await this._switchToFrameLocator(frameLocator)) {
        switchedToFrameCount += 1;
      }
    }
    return switchedToFrameCount;
  }

  /**
   * @private
   * @param {FrameLocator} frameTarget
   * @return {Promise<boolean>}
   */
  async _switchToFrameLocator(frameTarget) {
    const switchTo = this._driver.switchTo();

    if (frameTarget.getFrameIndex()) {
      await switchTo.frame(frameTarget.getFrameIndex());
      await this._updateFrameScrollRoot(frameTarget);
      return true;
    }

    if (frameTarget.getFrameNameOrId()) {
      await switchTo.frame(frameTarget.getFrameNameOrId());
      await this._updateFrameScrollRoot(frameTarget);
      return true;
    }

    if (frameTarget.getFrameElement()) {
      await switchTo.frame(frameTarget.getFrameElement());
      await this._updateFrameScrollRoot(frameTarget);
      return true;
    }

    if (frameTarget.getFrameSelector()) {
      const frameElement = this._driver.findElement(frameTarget.getFrameSelector());
      if (frameElement) {
        await switchTo.frame(frameElement);
        await this._updateFrameScrollRoot(frameTarget);
        return true;
      }
    }

    return false;
  }

  /**
   * @private
   * @param {FrameLocator} frameTarget
   */
  async _updateFrameScrollRoot(frameTarget) {
    const rootElement = await this._getScrollRootElementFromCheckSettings(frameTarget);
    const frame = this._driver.getFrameChain().peek();
    frame.setScrollRootElement(rootElement);
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkFullFrameOrElement(name, checkSettings) {
    const self = this;
    this._checkFrameOrElement = true;
    this._logger.verbose('checkFullFrameOrElement()');

    /**
     * @private
     * @type {RegionProvider}
     */
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /** @inheritDoc */
      async getRegion() {
        const region = await self._getFullFrameOrElementRegion();
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const source = await this._driver.getCurrentUrl();
    const result = await this.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings, source);
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
    this._logger.verbose('scrollRootElement_:', this._scrollRootElement);
    const originalFC = this._driver.getFrameChain().clone();
    const fc = this._driver.getFrameChain().clone();
    await this._driver.executeScript('window.scrollTo(0,0);');

    while (fc.size() > 0) {
      this._logger.verbose(`fc.Count: ${fc.size()}`);
      // driver.getRemoteWebDriver().switchTo().parentFrame();
      await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
      await this._driver.executeScript('window.scrollTo(0,0);');
      const prevFrame = fc.pop();
      const frame = fc.peek();
      let scrollRootElement = null;
      if (fc.size() === this._originalFC.size()) {
        this._logger.verbose('PositionProvider:', this._positionProviderHandler.get());
        this._positionMemento = await this._positionProviderHandler.get().getState();
        scrollRootElement = this._scrollRootElement;
      } else {
        if (frame != null) {
          scrollRootElement = await frame.getForceScrollRootElement(this._driver);
        }
        if (scrollRootElement == null) {
          scrollRootElement = this._driver.findElement(By.tagName('html'));
        }
      }
      this._logger.verbose('scrollRootElement:', scrollRootElement);

      const positionProvider = this._getElementPositionProvider(scrollRootElement);
      await positionProvider.setPosition(prevFrame.getLocation());

      const reg = new Region(Location.ZERO, prevFrame.getInnerSize());
      this._effectiveViewport.intersect(reg);
    }
    await this._driver.switchTo().frames(originalFC);
    return originalFC;
  }

  /**
   * @private
   * @param {WebElement} element
   * @return {Promise}
   */
  async _ensureElementVisible(element) {
    if (this._targetElement == null || !this.getScrollToRegion()) {
      // No element? we must be checking the window.
      return;
    }

    // if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
    //   this._logger.log("NATIVE context identified, skipping 'ensure element visible'");
    //   return;
    // }

    const originalFC = this._driver.getFrameChain().clone();
    const switchTo = this._driver.switchTo();

    const eyesWebElement = new EyesWebElement(this._logger, this._driver, element);
    let elementBounds = await eyesWebElement.getBounds();

    const currentFrameOffset = originalFC.getCurrentFrameOffset();
    elementBounds = elementBounds.offset(currentFrameOffset.getX(), currentFrameOffset.getY());

    const viewportBounds = await this._getViewportScrollBounds();

    this._logger.verbose(`viewportBounds: ${viewportBounds} ; elementBounds: ${elementBounds}`);

    if (!viewportBounds.contains(elementBounds)) {
      await this._ensureFrameVisible();

      const rect = await eyesWebElement.getRect();
      const elementLocation = new Location(rect);

      let scrollRootElement;
      if (originalFC.size() > 0 && !(await EyesWebElement.equals(element, originalFC.peek().getReference()))) {
        await switchTo.frames(originalFC);
        scrollRootElement = await this._driver.findElement(By.css('html'));
      } else {
        scrollRootElement = this._scrollRootElement;
      }

      const positionProvider = this._getElementPositionProvider(scrollRootElement);
      await positionProvider.setPosition(elementLocation);
    }
  }

  /**
   * @private
   * @return {Promise<Region>}
   */
  async _getViewportScrollBounds() {
    if (!this.getScrollToRegion()) {
      this._logger.log('WARNING: no region visibility strategy! returning an empty region!');
      return Region.EMPTY;
    }

    const originalFrameChain = this._driver.getFrameChain().clone();
    const switchTo = this._driver.switchTo();
    await switchTo.frames(this._originalFC);
    const spp = new ScrollPositionProvider(this._logger, this._jsExecutor, this._scrollRootElement);
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

    /**
     * @private
     * @type {RegionProvider}
     */
    const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
      // noinspection JSUnusedGlobalSymbols
      /** @inheritDoc */
      async getRegion() {
        const rect = await self._targetElement.getRect();
        // noinspection JSSuspiciousNameCombination
        const region = new Region(Math.ceil(rect.x), Math.ceil(rect.y), rect.width, rect.height, CoordinatesType.CONTEXT_RELATIVE);
        self._imageLocation = region.getLocation();
        return region;
      }
    };

    const source = await this._driver.getCurrentUrl();
    const result = await this.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings, source);
    this._logger.verbose('Done! trying to scroll back to original position...');
    return result;
  }

  /**
   * @private
   * @return {Promise<MatchResult>}
   */
  async _checkElement(eyesElement = this._targetElement, name, checkSettings) {
    this._regionToCheck = null;
    const scrollRootElement = await this.getCurrentFrameScrollRootElement();
    const positionProvider = this._createPositionProvider(scrollRootElement);
    const originalPositionMemento = await positionProvider.getState();

    await this._ensureElementVisible(this._targetElement);

    let result;
    let originalOverflow;
    const rect = await eyesElement.getRect();

    try {
      this._checkFrameOrElement = true;

      const displayStyle = await eyesElement.getComputedStyle('display');

      if (this._configuration.getHideScrollbars()) {
        originalOverflow = await eyesElement.getOverflow();
        await eyesElement.setOverflow('hidden');
      }

      const sizeAndBorders = await eyesElement.getSizeAndBorders();

      if (displayStyle !== 'inline' &&
        sizeAndBorders.height <= this._effectiveViewport.getHeight() &&
        sizeAndBorders.width <= this._effectiveViewport.getWidth()) {
        this._elementPositionProvider = new ElementPositionProvider(this._logger, this._driver, eyesElement);
      } else {
        this._elementPositionProvider = null;
      }

      const elementRegion = new Region(
        rect.x + sizeAndBorders.left,
        rect.y + sizeAndBorders.top,
        sizeAndBorders.width,
        sizeAndBorders.height,
        CoordinatesType.SCREENSHOT_AS_IS
      );

      this._logger.verbose('Element region:', elementRegion);

      this._regionToCheck = elementRegion;

      if (!this._effectiveViewport.isSizeEmpty()) {
        this._regionToCheck.intersect(this._effectiveViewport);
      }

      this._imageLocation = this._regionToCheck.getLocation();
      const source = await this._driver.getCurrentUrl();
      result = await this.checkWindowBase(new NullRegionProvider(), name, false, checkSettings, source);
    } finally {
      if (originalOverflow) {
        await eyesElement.setOverflow(originalOverflow);
      }

      this._checkFrameOrElement = false;

      await positionProvider.restoreState(originalPositionMemento);
      this._regionToCheck = null;
      this._elementPositionProvider = null;
      this._imageLocation = null;
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
      this._devicePixelRatio === Eyes.UNKNOWN_DEVICE_PIXEL_RATIO &&
      this._scaleProviderHandler.get() instanceof NullScaleProvider
    ) {
      let factory;
      this._logger.verbose('Trying to extract device pixel ratio...');

      try {
        this._devicePixelRatio = await EyesSeleniumUtils.getDevicePixelRatio(this._jsExecutor);
      } catch (err) {
        this._logger.verbose('Failed to extract device pixel ratio! Using default.', err);
        this._devicePixelRatio = Eyes.DEFAULT_DEVICE_PIXEL_RATIO;
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
    const element = await this._driver.findElement(By.css('html'));
    const entireSize = await EyesSeleniumUtils.getEntireElementSize(this._jsExecutor, element);

    return new ContextBasedScaleProviderFactory(
      this._logger,
      entireSize,
      this._viewportSizeHandler.get(),
      this._devicePixelRatio,
      false,
      this._scaleProviderHandler
    );
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    const results = await super.close(throwEx);

    if (this._runner) {
      this._runner._allTestResult.push(results);
    }

    return results;
  }

  /**
   * @inheritDoc
   */
  async getViewportSize() {
    let viewportSize = this._viewportSizeHandler.get();
    if (!viewportSize) {
      viewportSize = await this._driver.getDefaultContentViewportSize();
    }

    return viewportSize;
  }

  /**
   * @inheritDoc
   */
  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...');
      return await DomCapture.getFullWindowDom(this._logger, this._driver);
    } catch (err) {
      this._logger.log(`Error capturing DOM of the page: ${err}`);
      return '';
    }
  }

  /**
   * @private
   * @return {Promise<FrameChain>}
   */
  async _tryHideScrollbars() {
    // if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
    //   return new FrameChain(this._logger);
    // }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      const originalFC = this._driver.getFrameChain().clone();
      const fc = this._driver.getFrameChain().clone();
      let frame = fc.peek();

      if (fc.size() > 0) {
        while (fc.size() > 0) {
          this._logger.verbose(`fc.Count = ${fc.size()}`);

          if (this._stitchContent || fc.size() !== originalFC.size()) {
            if (frame === null) {
              this._logger.verbose('hiding scrollbars of element (1)');
              await EyesSeleniumUtils.setOverflow(this._driver, 'hidden', this._scrollRootElement);
              // await EyesSeleniumUtils.hideScrollbars(this._driver, 200, this._scrollRootElement);
            } else {
              await frame.hideScrollbars(this._driver);
            }
          }

          await this._driver.switchTo().parentFrame();
          fc.pop();
          frame = fc.peek();
        }
      } else {
        this._logger.verbose('hiding scrollbars of element (2)');
        this._originalOverflow = await EyesSeleniumUtils.setOverflow(this._driver, 'hidden', this._scrollRootElement);
      }

      this._logger.verbose('switching back to original frame');
      await this._driver.switchTo().frames(originalFC);
      this._logger.verbose('done hiding scrollbars.');
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
   * @return {Promise}
   */
  async _tryRestoreScrollbars(frameChain) {
    // if (await EyesSeleniumUtils.isMobileDevice(this._driver)) {
    //   return;
    // }

    if (this._configuration.getHideScrollbars() || (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent)) {
      await this._driver.switchTo().frames(frameChain);
      const originalFC = frameChain.clone();
      const fc = frameChain.clone();
      if (fc.size() > 0) {
        while (fc.size() > 0) {
          const frame = fc.pop();
          await frame.returnToOriginalOverflow(this._driver);
          await EyesTargetLocator.tryParentFrame(this._driver.getRemoteWebDriver().switchTo(), fc);
        }
      } else {
        this._logger.verbose('returning overflow of element to its original value');
        await EyesSeleniumUtils.setOverflow(this._driver, this._originalOverflow, this._scrollRootElement);
      }
      await this._driver.switchTo().frames(originalFC);
      this._logger.verbose('done restoring scrollbars.');
    } else {
      this._logger.verbose('no need to restore scrollbars.');
    }
    this._driver.getFrameChain().clear();
  }

  /*
  /**
   * @protected
   * @return {Promise}
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

  /**
   * Gets scroll root element.
   *
   * @override
   * @return {Promise<WebElement>} the scroll root element
   */
  async getScrollRootElement() {
    if (this._scrollRootElement == null) {
      this._scrollRootElement = await this._driver.findElement(By.css('html'));
    }
    return this._scrollRootElement;
  }

  /**
   * @private
   * @param {SeleniumCheckSettings} scrollRootElementContainer
   * @return {WebElement}
   */
  async _getScrollRootElementFromCheckSettings(scrollRootElementContainer) {
    // if (!EyesSeleniumUtils.isMobileDevice(driver)) {
    if (scrollRootElementContainer) {
      let scrollRootElement = await scrollRootElementContainer.getScrollRootElement();

      if (!scrollRootElement) {
        const scrollRootSelector = scrollRootElementContainer.getScrollRootSelector();
        if (scrollRootSelector) {
          scrollRootElement = await this._driver.findElement(scrollRootSelector);
        }
      }

      if (scrollRootElement) {
        return scrollRootElement;
      }
    }
    // }

    return this._driver.findElement(By.css('html'));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {EyesWebElement} scrollRootElement
   * @return {PositionProvider}
   */
  _getElementPositionProvider(scrollRootElement) {
    let positionProvider = scrollRootElement.getPositionProvider();
    if (positionProvider == null) {
      positionProvider = this._createPositionProvider(scrollRootElement);
      scrollRootElement.setPositionProvider(positionProvider);
    }

    this._logger.verbose('position provider:', positionProvider);
    this._currentFramePositionProvider = positionProvider;
    return positionProvider;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @inheritDoc
   */
  async getScreenshot() {
    this._logger.verbose('enter()');

    const scaleProviderFactory = await this._updateScalingParams();

    const originalFrameChain = this._driver.getFrameChain().clone();
    const switchTo = this._driver.switchTo();
    await switchTo.frames(this._originalFC);

    const positionProvider = this.getPositionProvider();
    let originalPosition = null;
    if (positionProvider) { // !EyesSeleniumUtils.isMobileDevice(this.driver)
      originalPosition = await positionProvider.getState();
    }
    await switchTo.frames(originalFrameChain);

    const scrollRootElement = await this.getCurrentFrameScrollRootElement();
    const originProvider = new ScrollPositionProvider(this._logger, this._jsExecutor, scrollRootElement);

    const algo = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this._configuration.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      originProvider,
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

      // if (!EyesSeleniumUtils.isMobileDevice(this.driver)) {
      await switchTo.frames(originalFrameChain);
      // }

      let entireFrameOrElement;
      if (!this._elementPositionProvider) {
        const scrollRootElement2 = await this._driver.findElement(By.css('html'));
        const elemPositionProvider = this._getElementPositionProvider(scrollRootElement2);
        await this._markElementForLayoutRCA(elemPositionProvider);
        entireFrameOrElement = await algo.getStitchedRegion(this._regionToCheck, null, elemPositionProvider);
      } else {
        await this._markElementForLayoutRCA(this._elementPositionProvider);
        entireFrameOrElement = await algo.getStitchedRegion(this._regionToCheck, null, this._elementPositionProvider);
      }

      this._logger.verbose('Building screenshot object...');
      const size = new RectangleSize(entireFrameOrElement.getWidth(), entireFrameOrElement.getHeight());
      result = await EyesWebDriverScreenshot.fromFrameSize(this._logger, this._driver, entireFrameOrElement, size);
    } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
      this._logger.verbose('Full page screenshot requested.');

      // Save the current frame path.
      const originalFramePosition = originalFrameChain.size() > 0 ?
        originalFrameChain.getDefaultContentScrollPosition() : new Location(Location.ZERO);

      await switchTo.frames(this._originalFC);
      const eyesScrollRootElement = new EyesWebElement(this._logger, this._driver, this._scrollRootElement);

      const rect = await eyesScrollRootElement.getRect();
      const sizeAndBorders = await eyesScrollRootElement.getSizeAndBorders();
      const region = new Region(rect.x + sizeAndBorders.left, rect.y + sizeAndBorders.top, sizeAndBorders.width, sizeAndBorders.height);

      await this._markElementForLayoutRCA(null);

      const fullPageImage = await algo.getStitchedRegion(region, null, this._positionProviderHandler.get());

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

    await switchTo.frames(this._originalFC);
    if (positionProvider) {
      await positionProvider.restoreState(originalPosition);
    }
    await switchTo.frames(originalFrameChain);

    this._logger.verbose('Done!');
    return result;
  }

  /**
   * @private
   * @param {PositionProvider} elemPositionProvider
   */
  async _markElementForLayoutRCA(elemPositionProvider) {
    const positionProvider = elemPositionProvider || this.getPositionProvider();
    const scrolledElement = await positionProvider.getScrolledElement();

    if (scrolledElement) {
      try {
        await this._jsExecutor.executeScript("arguments[0].setAttribute('data-applitools-scroll','true');", scrolledElement);
      } catch (err) {
        this._logger.verbose("Can't set data attribute for element", err);
      }
    }
  }
}

exports.EyesSelenium = EyesSelenium;
