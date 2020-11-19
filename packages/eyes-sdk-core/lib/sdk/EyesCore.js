'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const Region = require('../geometry/Region')
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const ImageRotation = require('../positioning/ImageRotation')
const ReadOnlyPropertyHandler = require('../handler/ReadOnlyPropertyHandler')
const TestFailedError = require('../errors/TestFailedError')
const EyesBase = require('./EyesBase')
const Logger = require('../logging/Logger')
const NullCutProvider = require('../cropping/NullCutProvider')
const EyesScreenshot = require('../capture/EyesScreenshotNew')
const GeneralUtils = require('../utils/GeneralUtils')
const SimplePropertyHandler = require('../handler/SimplePropertyHandler')
const NullScaleProvider = require('../scaling/NullScaleProvider')
const ScaleProviderIdentityFactory = require('../scaling/ScaleProviderIdentityFactory')
const FixedScaleProviderFactory = require('../scaling/FixedScaleProviderFactory')
const ContextBasedScaleProviderFactory = require('../scaling/ContextBasedScaleProviderFactory')
const ImageProviderFactory = require('../capture/ImageProviderFactory')
const TypeUtils = require('../utils/TypeUtils')
const MatchResult = require('../match/MatchResult')
const TestResults = require('../TestResults')

const UNKNOWN_DEVICE_PIXEL_RATIO = 0
const DEFAULT_DEVICE_PIXEL_RATIO = 1

/**
 * @typedef {import('../geometry/Region').RegionObject} RegionObject
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesWrappedDriver')<TDriver, TElement, TSelector>} EyesWrappedDriver
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesWrappedElement')<TDriver, TElement, TSelector>} EyesWrappedElement
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./frames/Frame').FrameReference<TDriver, TElement, TSelector>} FrameReference
 */

/**
 * @template TDriver
 * @template TElement
 * @template TSelector
 */
class EyesCore extends EyesBase {
  /**
   * @param {string} serverUrl
   * @param {boolean} isDisabled
   */
  constructor(serverUrl, isDisabled) {
    super(serverUrl, isDisabled)

    /** @type {EyesWrappedDriver<TDriver, TElement, TSelector>} */
    this._driver = undefined
    /** @private @type {EyesBrowsingContext<TDriver, TElement, TSelector>} */
    this._context = undefined
    /** @private @type {number} */
    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO
    /** @private */
    this._rotation = undefined
  }

  async _initCommon() {
    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO

    this._userAgent = this._driver.userAgent

    this._imageProvider = ImageProviderFactory.getImageProvider(
      this._logger,
      this._driver,
      this._rotation,
      this,
      this._userAgent,
    )
  }

  async check(nameOrCheckSettings, checkSettings) {
    if (this._configuration.getIsDisabled()) {
      this._logger.log(`check(${nameOrCheckSettings}, ${checkSettings}): Ignored`)
      return new MatchResult()
    }
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')
    if (TypeUtils.isNull(checkSettings) && !TypeUtils.isString(nameOrCheckSettings)) {
      checkSettings = nameOrCheckSettings
      nameOrCheckSettings = null
    }

    checkSettings = this.spec.newCheckSettings(checkSettings)

    if (TypeUtils.isString(nameOrCheckSettings)) {
      checkSettings.withName(nameOrCheckSettings)
    }

    this._logger.verbose(`check(${nameOrCheckSettings}, checkSettings) - begin`)

    return this._check(checkSettings)
  }

  async checkAndClose(checkSettings, throwEx) {
    if (this._configuration.getIsDisabled()) {
      this._logger.log(`checkAndClose(${checkSettings}): Ignored`)
      return new TestResults()
    }
    ArgumentGuard.isValidState(this._isOpen, 'Eyes not open')

    checkSettings = this.spec.newCheckSettings(checkSettings)

    this._logger.verbose(`checkAndClose(checkSettings) - begin`)

    return this._check(checkSettings, true, throwEx)
  }

  /* ------------ Classic API ------------ */
  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   * @param {string} [name] - An optional name to be associated with the snapshot.
   * @param {number} [timeout] - The amount of time to retry matching (Milliseconds).
   * @param {boolean} [isFully=false] - If {@code true}, stitch the internal content of the window.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkWindow(name, timeout, isFully = false) {
    return this.check({name, timeout, isFully})
  }
  /**
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   * @param {FrameReference<TDriver, TElement, TSelector>} element - The element which is the frame to switch to.
   * @param {number} [timeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [name] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkFrame(element, timeout, name) {
    return this.check({name, frames: [element], timeout, isFully: true})
  }
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} element - The element to check.
   * @param {number} [timeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [name] - An optional name to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElement(element, timeout, name) {
    return this.check({name, region: element, timeout, isFully: true})
  }
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   * @param {TSelector} locator - The element to check.
   * @param {number} [timeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [name] - An optional name to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElementBy(locator, timeout, name) {
    return this.check({name, region: locator, timeout, isFully: true})
  }
  /**
   * Visually validates a region in the screenshot.
   * @param {Region} region - The region to validate (in screenshot coordinates).
   * @param {string} [name] - An optional name to be associated with the screenshot.
   * @param {number} [timeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegion(region, name, timeout) {
    return this.check({name, region, timeout})
  }
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement} element - The element defining the region to validate.
   * @param {string} [name] - An optional name to be associated with the screenshot.
   * @param {number} [timeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionByElement(element, name, timeout) {
    return this.check({name, region: element, timeout})
  }
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {TSelector} by - The selector used for finding the region to validate.
   * @param {string} [name] - An optional name to be associated with the screenshot.
   * @param {number} [timeout] - The amount of time to retry matching.
   * @param {boolean} [isFully] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionBy(by, name, timeout, isFully = false) {
    return this.check({name, region: by, timeout, isFully})
  }
  /**
   * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by
   * the given selector.
   * @param {FrameReference<TDriver, TElement, TSelector>} frameReference - The name or id of the frame to switch to.
   * @param {TSelector} locator - A TSelector specifying the region to check.
   * @param {?number} [timeout] - The amount of time to retry matching. (Milliseconds)
   * @param {string} [name] - An optional name to be associated with the snapshot.
   * @param {boolean} [isFully] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionInFrame(frameReference, locator, timeout, name, isFully = false) {
    return this.check({name, region: locator, frames: [frameReference], timeout, isFully})
  }
  /* ------------ Redundant API ------------ */
  /**
   * @return {Promise}
   */
  async closeAsync() {
    await this.close(false)
  }
  /**
   * @return {Promise}
   */
  async abortAsync() {
    await this.abort()
  }
  /* ------------ Triggers API ------------ */
  /**
   * Adds a mouse trigger.
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {Location} cursor  The cursor's position relative to the control.
   */
  async addMouseTrigger(action, control, cursor) {
    if (this._configuration.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`)
      return
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`)
      return
    }

    if (!(await this._context.equals(this._lastScreenshot.context))) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return
    }

    EyesBase.prototype.addMouseTriggerBase.call(this, action, control, cursor)
  }
  /**
   * Adds a mouse trigger.
   * @param {MouseTrigger.MouseAction} action - Mouse action.
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} element - The element on which the click was called.
   * @return {Promise}
   */
  async addMouseTriggerForElement(action, element) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${action} (disabled)`)
      return Promise.resolve()
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${action} (no screenshot)`)
      return Promise.resolve()
    }

    if (!(await this._context.equals(this._lastScreenshot.context))) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return Promise.resolve()
    }

    ArgumentGuard.notNull(element, 'element')

    const loc = await element.getLocation()
    const ds = await element.getSize()
    const elementRegion = new Region(loc.x, loc.y, ds.width, ds.height)
    EyesBase.prototype.addMouseTriggerBase.call(
      this,
      action,
      elementRegion,
      elementRegion.getMiddleOffset(),
    )
  }
  /**
   * Adds a keyboard trigger.
   * @param {Region} control The control on which the trigger is activated (context relative coordinates).
   * @param {String} text  The trigger's text.
   */
  async addTextTrigger(control, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`)
      return
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`)
      return
    }

    if (!(await this._context.equals(this._lastScreenshot.context))) {
      this._logger.verbose(`Ignoring ${text} (different frame)`)
      return
    }

    EyesBase.prototype.addTextTriggerBase.call(this, control, text)
  }
  /**
   * Adds a keyboard trigger.
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} element The element for which we sent keys.
   * @param {String} text  The trigger's text.
   * @return {Promise}
   */
  async addTextTriggerForElement(element, text) {
    if (this.getIsDisabled()) {
      this._logger.verbose(`Ignoring ${text} (disabled)`)
      return Promise.resolve()
    }

    // Triggers are actually performed on the previous window.
    if (!this._lastScreenshot) {
      this._logger.verbose(`Ignoring ${text} (no screenshot)`)
      return Promise.resolve()
    }

    if (!(await this._context.equals(this._lastScreenshot.context))) {
      this._logger.verbose(`Ignoring ${text} (different frame)`)
      return Promise.resolve()
    }

    ArgumentGuard.notNull(element, 'element')

    const p1 = await element.getLocation()
    const ds = await element.getSize()
    const elementRegion = new Region(Math.ceil(p1.x), Math.ceil(p1.y), ds.width, ds.height)
    EyesBase.prototype.addTextTrigger.call(this, elementRegion, text)
  }
  /* ------------ Getters/Setters ------------ */
  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   * @override
   * @return {Promise<RectangleSize}} The viewport size of the AUT.
   */
  async getViewportSize() {
    const viewportSize = this._viewportSizeHandler.get()
    return viewportSize ? viewportSize : this._driver.getViewportSize()
  }

  /**
   * Sets the browser's viewport size
   * @param {TDriver} driver - driver object for the specific framework
   * @param {RectangleSize|{width: number, height: number}} viewportSize - viewport size
   */
  static async setViewportSize(driver, viewportSize) {
    const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
    const eyesDriver = await this.spec.newDriver(logger, driver).init()
    if (!eyesDriver.isMobile) {
      ArgumentGuard.notNull(viewportSize, 'viewportSize')
      await eyesDriver.setViewportSize(viewportSize)
    }
  }

  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   * @protected
   * @override
   */
  async setViewportSize(viewportSize) {
    if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
      this._logger.verbose('Ignored (viewport size given explicitly)')
      return Promise.resolve()
    }

    if (!this._driver.isMobile) {
      ArgumentGuard.notNull(viewportSize, 'viewportSize')
      viewportSize = new RectangleSize(viewportSize)
      try {
        await this._driver.setViewportSize(viewportSize)
        this._effectiveViewport = new Region(Location.ZERO, viewportSize)
      } catch (e) {
        const viewportSize = await this._driver.getViewportSize()
        this._viewportSizeHandler.set(viewportSize)
        throw new TestFailedError('Failed to set the viewport size', e)
      }
    }

    this._viewportSizeHandler.set(new RectangleSize(viewportSize))
  }

  /**
   * Run visual locators
   * @template {string} TLocatorName
   * @param {Object} visualLocatorSettings
   * @param {Readonly<TLocatorName[]>} visualLocatorSettings.locatorNames
   * @param {boolean} visualLocatorSettings.firstOnly
   * @return {Promise<{[TKey in TLocatorName]: RegionObject[]}>}
   */
  async locate(visualLocatorSettings) {
    ArgumentGuard.notNull(visualLocatorSettings, 'visualLocatorSettings')
    this._logger.verbose('Get locators with given names: ', visualLocatorSettings.locatorNames)
    const screenshot = await this._getViewportScreenshot()
    const screenshotBuffer = await screenshot.getImage().getImageBuffer()
    const id = GeneralUtils.guid()
    await this.getAndSaveRenderingInfo()
    const imageUrl = await this._serverConnector.uploadScreenshot(id, screenshotBuffer)
    const appName = this._configuration.getAppName()
    return this._serverConnector.postLocators({
      appName,
      imageUrl,
      locatorNames: visualLocatorSettings.locatorNames,
      firstOnly: visualLocatorSettings.firstOnly,
    })
  }

  /**
   * Create a viewport page screenshot
   * @return {Promise<EyesScreenshot>}
   */
  async _getViewportScreenshot() {
    this._logger.verbose('Screenshot requested...')
    const scaleProviderFactory = await this._updateScalingParams()

    let screenshotImage = await this._imageProvider.getImage()
    await this._debugScreenshotsProvider.save(screenshotImage, 'original')

    const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth())
    if (scaleProvider.getScaleRatio() !== 1) {
      this._logger.verbose('scaling...')
      screenshotImage = await screenshotImage.scale(scaleProvider.getScaleRatio())
      await this._debugScreenshotsProvider.save(screenshotImage, 'scaled')
    }

    const cutProvider = this._cutProviderHandler.get()
    if (!(cutProvider instanceof NullCutProvider)) {
      this._logger.verbose('cutting...')
      screenshotImage = await cutProvider.cut(screenshotImage)
      await this._debugScreenshotsProvider.save(screenshotImage, 'cut')
    }

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(this._logger, this, screenshotImage)
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _updateScalingParams() {
    // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
    if (
      this._devicePixelRatio !== UNKNOWN_DEVICE_PIXEL_RATIO &&
      !(this._scaleProviderHandler.get() instanceof NullScaleProvider)
    ) {
      // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
      const nullProvider = new SimplePropertyHandler()
      return new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider)
    }

    this._devicePixelRatio = await this._driver.getPixelRatio().catch(err => {
      this._logger.verbose('Failed to extract device pixel ratio! Using default.', err)
      return DEFAULT_DEVICE_PIXEL_RATIO
    })

    this._logger.verbose('Setting scale provider...')
    return this._getScaleProviderFactory()
  }

  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const defaultScaleProviderFactory = new FixedScaleProviderFactory(
      1 / this._devicePixelRatio,
      this._scaleProviderHandler,
    )

    if (this._driver.isNative) {
      return defaultScaleProviderFactory
    } else {
      try {
        const entireSize = await this._context.getDocumentSize()
        return new ContextBasedScaleProviderFactory(
          this._logger,
          entireSize,
          this._viewportSizeHandler.get(),
          this._devicePixelRatio,
          this._driver.isMobile,
          this._scaleProviderHandler,
        )
      } catch (err) {
        this._logger.verbose('Failed to set ContextBasedScaleProvider.', err)
        this._logger.verbose('Using FixedScaleProvider instead...')
        return defaultScaleProviderFactory
      }
    }
  }

  /**
   * @private
   */
  async _getAndSaveBatchInfoFromServer(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    return this._runner.getBatchInfoWithCache(batchId)
  }

  /**
   * @private
   */
  async getAndSaveRenderingInfo() {
    const renderingInfo = await this._runner.getRenderingInfoWithCache()
    this._serverConnector.setRenderingInfo(renderingInfo)
  }

  async getAUTSessionId() {
    if (!this._driver) {
      return undefined
    }
    return this._driver.sessionId
  }

  async getTitle() {
    return this._driver.getTitle()
  }
  /**
   * @return {EyesWrappedDriver<TDriver, TElement, TSelector>}
   */
  getDriver() {
    return this._driver
  }
  /**
   * @return {TDriver}
   */
  getRemoteWebDriver() {
    return this._driver.unwrapped
  }
  /**
   * @return {EyesRunner}
   */
  getRunner() {
    return this._runner
  }
  /**
   * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if it wasn't possible to extract it.
   */
  getDevicePixelRatio() {
    return this._devicePixelRatio
  }
  /**
   * @return {Region}
   */
  getRegionToCheck() {
    return this._regionToCheck
  }
  /**
   * @param {Region} regionToCheck
   */
  setRegionToCheck(regionToCheck) {
    this._regionToCheck = regionToCheck
  }
  /**
   * @return {boolean}
   */
  shouldStitchContent() {
    return this._stitchContent
  }
  /**
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>|TElement|TSelector} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    if (scrollRootElement === null) {
      this._scrollRootElement = null
    } else if (this.spec.isSelector(scrollRootElement) || this.spec.isElement(scrollRootElement)) {
      this._scrollRootElement = scrollRootElement
    } else {
      this._scrollRootElement = undefined
    }
  }
  /**
   * @return {Promise<TElement|TSelector>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @param {ImageRotation} rotation - The image rotation data.
   */
  setRotation(rotation) {
    this._rotation = rotation

    if (this._driver) {
      this._driver.setRotation(rotation)
    }
  }

  /**
   * @return {ImageRotation} - The image rotation data.
   */
  getRotation() {
    return this._rotation
  }

  /**
   * Set the image rotation degrees.
   * @param {number} degrees - The amount of degrees to set the rotation to.
   * @deprecated use {@link setRotation} instead
   */
  setForcedImageRotation(degrees) {
    this.setRotation(new ImageRotation(degrees))
  }

  /**
   * Get the rotation degrees.
   * @return {number} - The rotation degrees.
   * @deprecated use {@link getRotation} instead
   */
  getForcedImageRotation() {
    return this.getRotation().getRotation()
  }

  /**
   * A url pointing to a DOM capture of the AUT at the time of screenshot
   *
   * @override
   * @protected
   * @return {Promise<string>}
   */
  async getDomUrl() {
    return this._domUrl
  }

  /**
   * @param {string} domUrl
   */
  setDomUrl(domUrl) {
    this._domUrl = domUrl
  }

  /**
   * @param {CorsIframeHandle} corsIframeHandle
   */
  setCorsIframeHandle(corsIframeHandle) {
    this._corsIframeHandle = corsIframeHandle
  }

  /**
   * @return {CorsIframeHandle}
   */
  getCorsIframeHandle() {
    return this._corsIframeHandle
  }

  /* -------- Getters/Setters from Configuration -------- */

  /**
   * @return {boolean}
   */
  getHideCaret() {
    return this._configuration.getHideCaret()
  }

  /**
   * @param {boolean} hideCaret
   */
  setHideCaret(hideCaret) {
    this._configuration.setHideCaret(hideCaret)
  }

  /**
   * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
   *
   * @param {boolean} shouldForce - Whether to force a full page screenshot or not.
   */
  setForceFullPageScreenshot(shouldForce) {
    this._configuration.setForceFullPageScreenshot(shouldForce)
  }

  /**
   * @return {boolean} - Whether Eyes should force a full page screenshot.
   */
  getForceFullPageScreenshot() {
    return this._configuration.getForceFullPageScreenshot()
  }

  /**
   * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
   * full page stitching).
   *
   * @param {number} waitBeforeScreenshots - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
   *   default value to be used.
   */
  setWaitBeforeScreenshots(waitBeforeScreenshots) {
    this._configuration.setWaitBeforeScreenshots(waitBeforeScreenshots)
  }

  /**
   * @return {number} - The time to wait just before taking a screenshot.
   */
  getWaitBeforeScreenshots() {
    return this._configuration.getWaitBeforeScreenshots()
  }

  /**
   * Hide the scrollbars when taking screenshots.
   *
   * @param {boolean} shouldHide - Whether to hide the scrollbars or not.
   */
  setHideScrollbars(shouldHide) {
    this._configuration.setHideScrollbars(shouldHide)
  }

  /**
   * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
   */
  getHideScrollbars() {
    return this._configuration.getHideScrollbars()
  }

  /**
   * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
   * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
   *
   * @param {StitchMode} mode - The stitch mode to set.
   */
  setStitchMode(mode) {
    this._logger.verbose(`setting stitch mode to ${mode}`)
    this._configuration.setStitchMode(mode)
  }

  /**
   * @return {StitchMode} - The current stitch mode settings.
   */
  getStitchMode() {
    return this._configuration.getStitchMode()
  }

  /**
   * Sets the stitching overlap in pixels.
   *
   * @param {number} stitchOverlap - The width (in pixels) of the overlap.
   */
  setStitchOverlap(stitchOverlap) {
    this._configuration.setStitchOverlap(stitchOverlap)
  }

  /**
   * @return {number} - Returns the stitching overlap in pixels.
   */
  getStitchOverlap() {
    return this._configuration.getStitchOverlap()
  }
}

module.exports = EyesCore
