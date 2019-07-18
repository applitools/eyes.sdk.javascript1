'use strict';

const { URL } = require('url');

const {
  Logger,
  ReadOnlyPropertyHandler,
  Region,
  Location,
  RectangleSize,
  ArgumentGuard,
} = require('@applitools/eyes-common');

const {
  EyesBase,
  TestFailedError,
  CorsIframeHandle,
} = require('@applitools/eyes-sdk-core');

const { Configuration } = require('./config/Configuration');
const { ClassicRunner } = require('./runner/ClassicRunner');
const { FrameChain } = require('./frames/FrameChain');
const { EyesSeleniumUtils } = require('./EyesSeleniumUtils');
const { ImageRotation } = require('./positioning/ImageRotation');

const { MoveToRegionVisibilityStrategy } = require('./regionVisibility/MoveToRegionVisibilityStrategy');
const { NopRegionVisibilityStrategy } = require('./regionVisibility/NopRegionVisibilityStrategy');
const { JavascriptHandler } = require('./JavascriptHandler');
const { EyesWebDriver } = require('./wrappers/EyesWebDriver');
const { Target } = require('./fluent/Target');
const { SeleniumJavaScriptExecutor } = require('./SeleniumJavaScriptExecutor');

const VERSION = require('../package.json').version;

/**
 * The main API gateway for the SDK.
 *
 * @abstract
 */
class Eyes extends EyesBase {
  /** @var {Logger} Eyes#_logger */
  /** @var {Configuration} Eyes#_configuration */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @signature `new Eyes()`
   *
   * @signature `new Eyes(runner)`
   * @sigparam {EyesRunner} [runner] - Set {@code EyesRunner} to use, default is ClassicRunner.
   *
   * @signature `new Eyes(serverUrl, isDisabled, runner)`
   * @sigparam {string} [serverUrl] - The Eyes server URL.
   * @sigparam {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @sigparam {EyesRunner} [runner=false] - Set {@code EyesRunner} to use, default is ClassicRunner.
   *
   * @param {string|boolean|EyesRunner} [serverUrl] - The Eyes server URL or set {@code true} if you want to use VisualGrid service.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
   * @param {EyesRunner} [runner=false] - Set {@code EyesRunner} to use, default is ClassicRunner.
   */
  constructor(serverUrl, isDisabled, runner = new ClassicRunner()) {
    if (new.target === Eyes) {
      throw new TypeError('Cannot construct `Eyes` instances directly. ' +
        'Please use `EyesSelenium`, `EyesVisualGrid` or `EyesFactory` instead.');
    }

    super(serverUrl, isDisabled, new Configuration());

    /** @type {EyesRunner} */ this._runner = runner;
    this._runner._eyesInstances.push(this);

    /** @type {EyesWebDriver} */
    this._driver = undefined;
    /** @type {SeleniumJavaScriptExecutor} */
    this._jsExecutor = undefined;

    /** @type {string} */
    this._domUrl = undefined;
    /** @type {Region} */
    this._regionToCheck = undefined;
    /** @type {WebElement} */
    this._scrollRootElement = undefined;
    /** @type {ImageRotation} */
    this._rotation = undefined;
    /** @type {number} */
    this._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
    /** @type {RegionVisibilityStrategy} */
    this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger);
    /** @type {ElementPositionProvider} */
    this._elementPositionProvider = undefined;
    /** @type {boolean} */
    this._stitchContent = false;
    /** @type {boolean} */
    this._dontGetTitle = false;
    /** @type {CorsIframeHandle} */
    this._corsIframeHandle = CorsIframeHandle.KEEP;

    EyesSeleniumUtils.setJavascriptHandler(new JavascriptHandler());
  }

  /**
   * @return {Configuration}
   */
  getConfiguration() {
    return this._configuration.cloneConfig();
  }

  /**
   * @override
   * @param {Configuration|object} configuration
   */
  setConfiguration(configuration) {
    if (!(configuration instanceof Configuration)) {
      configuration = new Configuration(configuration);
    }

    this._configuration = configuration;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @override
   * @protected
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    return `eyes.selenium.javascript/${VERSION}`;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Starts a test.
   *
   * @abstract
   * @param {WebDriver} driver - The web driver that controls the browser hosting the application under test.
   * @param {string} [appName] - The of the application under the test.
   * @param {string} [testName] - The test name.
   * @param {RectangleSize|RectangleSizeObject} [viewportSize] - The required browser's viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
   * @param {SessionType} [sessionType] - The type of test (e.g.,  standard test / visual performance test).
   * @return {Promise<EyesWebDriver>} - A wrapped WebDriver which enables Eyes trigger recording and frame handling.
   */
  async open(driver, appName, testName, viewportSize, sessionType) { // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!');
  }

  /**
   * @protected
   */
  _initDriver(driver) {
    if (driver instanceof EyesWebDriver) {
      // noinspection JSValidateTypes
      this._driver = driver;
    } else {
      this._driver = new EyesWebDriver(this._logger, this, driver);
    }

    this._jsExecutor = new SeleniumJavaScriptExecutor(this._driver);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Perform visual validation
   *
   * @abstract
   * @param {string} name - A name to be associated with the match
   * @param {SeleniumCheckSettings} checkSettings - Target instance which describes whether we want a window/region/frame
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async check(name, checkSettings) { // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @param {string} [tag] - An optional tag to be associated with the snapshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching (Milliseconds).
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkWindow(tag, matchTimeout) {
    return this.check(tag, Target.window().timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   *
   * @param {number|string|By|WebElement|EyesWebElement} element - The element which is the frame to switch to.
   * @param {number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkFrame(element, matchTimeout, tag) {
    return this.check(tag, Target.frame(element).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   *
   * @param {WebElement|EyesWebElement} element - The element to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElement(element, matchTimeout, tag) {
    return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   *
   * @param {By} locator - The element to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElementBy(locator, matchTimeout, tag) {
    return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {Region} region - The region to validate (in screenshot coordinates).
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegion(region, tag, matchTimeout) {
    return this.check(tag, Target.region(region).timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {WebElement|EyesWebElement} element - The element defining the region to validate.
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionByElement(element, tag, matchTimeout) {
    return this.check(tag, Target.region(element).timeout(matchTimeout));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {By} by - The WebDriver selector used for finding the region to validate.
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionBy(by, tag, matchTimeout, stitchContent = false) {
    return this.check(tag, Target.region(by).timeout(matchTimeout).stitchContent(stitchContent));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by
   * the given selector.
   *
   * @param {string} frameNameOrId - The name or id of the frame to switch to. (as would be used in a call to
   *   driver.switchTo().frame()).
   * @param {By} locator - A Selector specifying the region to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching. (Milliseconds)
   * @param {string} [tag] - An optional tag to be associated with the snapshot.
   * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionInFrame(frameNameOrId, locator, matchTimeout, tag, stitchContent = false) {
    return this.check(tag, Target.region(locator, frameNameOrId).timeout(matchTimeout).stitchContent(stitchContent));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a mouse trigger.
   *
   * @param {MouseTrigger.MouseAction} action - Mouse action.
   * @param {Region} control - The control on which the trigger is activated (context relative coordinates).
   * @param {Location} cursor - The cursor's position relative to the control.
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
   * @param {MouseTrigger.MouseAction} action - Mouse action.
   * @param {EyesWebElement} element - The WebElement on which the click was called.
   * @return {Promise}
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
   * @param {Region} control - The control on which the trigger is activated (context relative coordinates).
   * @param {string} text - The trigger's text.
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
   * @param {EyesWebElement} element - The element for which we sent keys.
   * @param {string} text - The trigger's text.
   * @return {Promise}
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
    // noinspection JSSuspiciousNameCombination
    const elementRegion = new Region(Math.ceil(rect.x), Math.ceil(rect.y), rect.width, rect.height);

    super.addTextTrigger(elementRegion, text);
  }

  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  /**
   * @return {Promise}
   */
  async closeAsync() {
    await this.close(false);
  }

  /**
   * @return {Promise<RectangleSize>} - The viewport size of the AUT.
   */
  async getViewportSize() {
    return this._configuration.getViewportSize();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, string, string)}.
   *
   * @override
   * @protected
   * @param {RectangleSize} size - The required viewport size.
   * @return {Promise}
   */
  async setViewportSize(size) {
    if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
      this._logger.verbose('Ignored (viewport size given explicitly)');
      return;
    }

    ArgumentGuard.notNull(size, 'size');
    size = new RectangleSize(size);
    this._configuration.setViewportSize(size);

    if (this._driver) {
      const originalFrame = this._driver.getFrameChain();
      await this._driver.switchTo().defaultContent();

      try {
        await EyesSeleniumUtils.setViewportSize(this._logger, this._driver, size);
        this._effectiveViewport = new Region(Location.ZERO, size);
      } catch (err) {
        await this._driver.switchTo().frames(originalFrame); // Just in case the user catches that error
        throw new TestFailedError('Failed to set the viewport size', err);
      }

      await this._driver.switchTo().frames(originalFrame);
      this._viewportSizeHandler.set(new RectangleSize(size));
    }
  }

  // noinspection JSUnusedGlobalSymbols, JSCheckFunctionSignatures
  /**
   * Call this method if for some reason you don't want to call {@link #open(WebDriver, string, string)} (or one of its
   * variants) yet.
   *
   * @param {EyesWebDriver} driver - The driver to use for getting the viewport.
   * @return {Promise<RectangleSize>} - The viewport size of the current context.
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
   * @param {EyesWebDriver} driver - The driver to use for setting the viewport.
   * @param {RectangleSize} viewportSize - The required viewport size.
   * @return {Promise}
   */
  static async setViewportSize(driver, viewportSize) {
    ArgumentGuard.notNull(driver, 'driver');
    ArgumentGuard.notNull(viewportSize, 'viewportSize');

    await EyesSeleniumUtils.setViewportSize(new Logger(), driver, new RectangleSize(viewportSize));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The device pixel ratio, or {@link Eyes.UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if
   *   it wasn't possible to extract it.
   */
  getDevicePixelRatio() {
    return this._devicePixelRatio;
  }

  /**
   * The inferred string is in the format "source:info" where source is either "useragent" or "pos".
   * Information associated with a "useragent" source is a valid browser user agent string. Information associated with
   * a "pos" source is a string of the format "process-name;os-name" where "process-name" is the name of the main
   * module of the executed process and "os-name" is the OS name.
   *
   * @override
   * @protected
   * @return {Promise<string>} - The inferred environment string or {@code null} if none is available.
   */
  async getInferredEnvironment() {
    try {
      const userAgent = await this._driver.getUserAgent();
      return `useragent:${userAgent}`;
    } catch (ignored) {
      return undefined;
    }
  }

  /**
   * An updated screenshot.
   *
   * @override
   * @protected
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    return undefined;
  }

  /**
   * The current title of of the AUT.
   *
   * @override
   * @protected
   * @return {Promise<string>}
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

  /**
   * @override
   * @protected
   * @return {Promise<?string>}
   */
  async getOrigin() {
    const currentUrl = await this.getDriver().getCurrentUrl();
    return new URL(currentUrl).origin;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get the session id.
   * @return {Promise<string>} - A promise which resolves to the webdriver's session ID.
   */
  async getAUTSessionId() {
    if (!this._driver) {
      return undefined;
    }

    return this._driver.getSessionId();
  }

  /* ------------ Getters/Setters ------------ */

  /**
   * @return {?EyesWebDriver}
   */
  getDriver() {
    return this._driver;
  }

  /**
   * @return {EyesRunner}
   */
  getRunner() {
    return this._runner;
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

  // noinspection JSUnusedGlobalSymbols
  /**
   * Turns on/off the automatic scrolling to a region being checked by {@code checkRegion}.
   *
   * @param {boolean} shouldScroll - Whether to automatically scroll to a region being validated.
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
   * @return {boolean} - Whether to automatically scroll to a region being validated.
   */
  getScrollToRegion() {
    return !(this._regionVisibilityStrategy instanceof NopRegionVisibilityStrategy);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {By} element
   */
  setScrollRootElement(element) {
    this._scrollRootElement = this._driver.findElement(element);
  }

  /**
   * Gets original fc.
   *
   * @return {FrameChain} the original fc
   */
  getOriginalFC() {
    return this._originalFC;
  }

  /**
   * Gets current frame position provider.
   *
   * @return {PositionProvider} - the current frame position provider
   */
  getCurrentFramePositionProvider() {
    return this._currentFramePositionProvider;
  }

  /**
   * Gets current frame scroll root element.
   *
   * @ignore
   * @return {Promise<WebElement>} - the current frame scroll root element
   */
  async getCurrentFrameScrollRootElement() {
    const currentFrame = this._driver.getFrameChain().peek();

    let scrollRootElement = null;
    if (currentFrame) {
      scrollRootElement = await currentFrame.getForceScrollRootElement(this._driver);
    }

    if (!scrollRootElement) {
      scrollRootElement = await this.getScrollRootElement();
    }

    return scrollRootElement;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<WebElement>}
   */
  async getScrollRootElement() {
    return this._scrollRootElement;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {ImageRotation} rotation - The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation;

    if (this._driver) {
      this._driver.setRotation(rotation);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ImageRotation} - The image rotation data.
   */
  getRotation() {
    return this._rotation;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the image rotation degrees.
   * @param {number} degrees - The amount of degrees to set the rotation to.
   * @deprecated use {@link setRotation} instead
   */
  setForcedImageRotation(degrees) {
    this.setRotation(new ImageRotation(degrees));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get the rotation degrees.
   * @return {number} - The rotation degrees.
   * @deprecated use {@link getRotation} instead
   */
  getForcedImageRotation() {
    return this.getRotation().getRotation();
  }

  /**
   * A url pointing to a DOM capture of the AUT at the time of screenshot
   *
   * @override
   * @protected
   * @return {Promise<?string>}
   */
  async getDomUrl() {
    return this._domUrl;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} domUrl
   */
  setDomUrl(domUrl) {
    this._domUrl = domUrl;
  }

  /**
   * @param {CorsIframeHandle} corsIframeHandle
   */
  setCorsIframeHandle(corsIframeHandle) {
    this._corsIframeHandle = corsIframeHandle;
  }

  /**
   * @return {CorsIframeHandle}
   */
  getCorsIframeHandle() {
    return this._corsIframeHandle;
  }

  /* ------------ Getters/Setters from Configuration ------------ */

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
   * @param {boolean} shouldForce - Whether to force a full page screenshot or not.
   */
  setForceFullPageScreenshot(shouldForce) {
    this._configuration.setForceFullPageScreenshot(shouldForce);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether Eyes should force a full page screenshot.
   */
  getForceFullPageScreenshot() {
    return this._configuration.getForceFullPageScreenshot();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} waitBeforeScreenshots - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   */
  setWaitBeforeScreenshots(waitBeforeScreenshots) {
    this._configuration.setWaitBeforeScreenshots(waitBeforeScreenshots);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - The time to wait just before taking a screenshot.
   */
  getWaitBeforeScreenshots() {
    return this._configuration.getWaitBeforeScreenshots();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} shouldHide - Whether to hide the scrollbars or not.
   */
  setHideScrollbars(shouldHide) {
    this._configuration.setHideScrollbars(shouldHide);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
   */
  getHideScrollbars() {
    return this._configuration.getHideScrollbars();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
   * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} mode - The stitch mode to set.
   */
  setStitchMode(mode) {
    this._logger.verbose(`setting stitch mode to ${mode}`);
    this._configuration.setStitchMode(mode);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {StitchMode} - The current stitch mode settings.
   */
  getStitchMode() {
    return this._configuration.getStitchMode();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets the stitching overlap in pixels.
   *
   * @param {number} stitchOverlap - The width (in pixels) of the overlap.
   */
  setStitchOverlap(stitchOverlap) {
    this._configuration.setStitchOverlap(stitchOverlap);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number} - Returns the stitching overlap in pixels.
   */
  getStitchOverlap() {
    return this._configuration.getStitchOverlap();
  }
}

Eyes.UNKNOWN_DEVICE_PIXEL_RATIO = 0;
Eyes.DEFAULT_DEVICE_PIXEL_RATIO = 1;
exports.Eyes = Eyes;
