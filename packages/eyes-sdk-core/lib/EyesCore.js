const {ArgumentGuard} = require('./utils/ArgumentGuard')
const {Region} = require('./geometry/Region')
const FrameChain = require('./frames/FrameChain')
const ImageRotation = require('./positioning/ImageRotation')
const {EyesBase} = require('./EyesBase')

/**
 * @typedef {import('./wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./wrappers/EyesWrappedElement').SupportedElement} SupportedElement
 * @typedef {import('./wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('./frames/Frame').FrameReference} FrameReference
 */

class EyesCore extends EyesBase {
  /* ------------ Classic API ------------ */
  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   * @param {string} [tag] - An optional tag to be associated with the snapshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching (Milliseconds).
   * @param {boolean} [stitchContent=false] - If {@code true}, stitch the internal content of the window.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkWindow(tag, matchTimeout, stitchContent = false) {
    return this.check(
      tag,
      this.constructor.CheckSettings.window()
        .timeout(matchTimeout)
        .stitchContent(stitchContent),
    )
  }
  /**
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   * @param {FrameReference} element - The element which is the frame to switch to.
   * @param {number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkFrame(element, matchTimeout, tag) {
    return this.check(
      tag,
      this.constructor.CheckSettings.frame(element)
        .timeout(matchTimeout)
        .fully(),
    )
  }
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   * @param {EyesWrappedElement|SupportedElement} element - The element to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElement(element, matchTimeout, tag) {
    return this.check(
      tag,
      this.constructor.CheckSettings.region(element)
        .timeout(matchTimeout)
        .fully(),
    )
  }
  /**
   * Takes a snapshot of the application under test and matches a specific element with the expected region output.
   * @param {SupportedSelector} locator - The element to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
   * @param {string} [tag] - An optional tag to be associated with the match.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkElementBy(locator, matchTimeout, tag) {
    return this.check(
      tag,
      this.constructor.CheckSettings.region(locator)
        .timeout(matchTimeout)
        .fully(),
    )
  }
  /**
   * Visually validates a region in the screenshot.
   * @param {Region} region - The region to validate (in screenshot coordinates).
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegion(region, tag, matchTimeout) {
    return this.check(tag, this.constructor.CheckSettings.region(region).timeout(matchTimeout))
  }
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {EyesWrappedElement|SupportedElement} element - The element defining the region to validate.
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionByElement(element, tag, matchTimeout) {
    return this.check(tag, this.constructor.CheckSettings.region(element).timeout(matchTimeout))
  }
  /**
   * Visually validates a region in the screenshot.
   *
   * @param {SupportedSelector} by - The selector used for finding the region to validate.
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionBy(by, tag, matchTimeout, stitchContent = false) {
    return this.check(
      tag,
      this.constructor.CheckSettings.region(by)
        .timeout(matchTimeout)
        .stitchContent(stitchContent),
    )
  }
  /**
   * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by
   * the given selector.
   * @param {FrameReference} frameReference - The name or id of the frame to switch to.
   * @param {SupportedSelector} locator - A Selector specifying the region to check.
   * @param {?number} [matchTimeout] - The amount of time to retry matching. (Milliseconds)
   * @param {string} [tag] - An optional tag to be associated with the snapshot.
   * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
   *   {@link #checkElement(By, number, string)} on the region.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegionInFrame(frameReference, locator, matchTimeout, tag, stitchContent = false) {
    return this.check(
      tag,
      this.constructor.CheckSettings.region(locator, frameReference)
        .timeout(matchTimeout)
        .stitchContent(stitchContent),
    )
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

    if (
      !(await FrameChain.equals(this._context.frameChain, this._lastScreenshot.getFrameChain()))
    ) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return
    }

    EyesBase.prototype.addMouseTriggerBase.call(this, action, control, cursor)
  }
  /**
   * Adds a mouse trigger.
   * @param {MouseTrigger.MouseAction} action  Mouse action.
   * @param {EyesWrappedElement} element The element on which the click was called.
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

    if (
      !(await FrameChain.equals(this._context.frameChain, this._lastScreenshot.getFrameChain()))
    ) {
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

    if (
      !(await FrameChain.equals(this._context.frameChain, this._lastScreenshot.getFrameChain()))
    ) {
      this._logger.verbose(`Ignoring ${text} (different frame)`)
      return
    }

    EyesBase.prototype.addTextTriggerBase.call(this, control, text)
  }
  /**
   * Adds a keyboard trigger.
   * @param {EyesWrappedElement} element The element for which we sent keys.
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

    if (
      !(await FrameChain.equals(this._context.frameChain, this._lastScreenshot.getFrameChain()))
    ) {
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
  async getAUTSessionId() {
    if (!this._driver) {
      return undefined
    }
    return this._controller.getAUTSessionId()
  }

  async getTitle() {
    if (!this._dontGetTitle) {
      try {
        return await this._controller.getTitle()
      } catch (e) {
        this._logger.verbose(`failed (${e})`)
        this._dontGetTitle = true
      }
    }
    return ''
  }
  /**
   * @return {?EyesWrappedDriver}
   */
  getDriver() {
    return this._driver
  }

  getRemoteWebDriver() {
    return this._driver.unwrapped
  }
  /**
   * Get jsExecutor
   * @return {EyesJsExecutor}
   */
  get jsExecutor() {
    return this._executor
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
   * @param {EyesWrappedElement|SupportedElement|SupportedSelector} element
   */
  setScrollRootElement(scrollRootElement) {
    if (this.constructor.WrappedElement.isSelector(scrollRootElement)) {
      this._scrollRootElement = this.constructor.WrappedElement.fromSelector(scrollRootElement)
    } else if (this.constructor.WrappedElement.isCompatible(scrollRootElement)) {
      this._scrollRootElement = scrollRootElement
    } else {
      this._scrollRootElement = null
    }
  }
  /**
   * @return {Promise<(EyesWrappedElement|SupportedElement|SupportedSelector)?>}
   */
  async getScrollRootElement() {
    if (this._scrollRootElement) {
      return this._driver ? this._scrollRootElement.init(this._driver) : this._scrollRootElement
    }
    return null
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
   * @return {Promise<?string>}
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
