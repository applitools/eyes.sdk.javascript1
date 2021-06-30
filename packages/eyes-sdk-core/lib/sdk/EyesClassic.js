'use strict'
const StitchMode = require('../config/StitchMode')
const TypeUtils = require('../utils/TypeUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const CoordinatesType = require('../geometry/CoordinatesType')
const Region = require('../geometry/Region')
const Location = require('../geometry/Location')
const FailureReports = require('../FailureReports')
const FullPageCaptureAlgorithm = require('../capture/FullPageCaptureAlgorithm')
const EyesScreenshot = require('../capture/EyesScreenshotNew')
const EyesScreenshotFactory = require('../capture/EyesScreenshotFactory')
const NullRegionProvider = require('../positioning/NullRegionProvider')
const RegionProvider = require('../positioning/RegionProvider')
const RegionPositionCompensationFactory = require('../positioning/RegionPositionCompensationFactory')
const CssTranslatePositionProvider = require('../positioning/CssTranslatePositionProvider')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const CssTranslateElementPositionProvider = require('../positioning/CssTranslateElementPositionProvider')
const ScrollElementPositionProvider = require('../positioning/ScrollElementPositionProvider')
const ClassicRunner = require('../runner/ClassicRunner')
const takeDomCapture = require('../utils/takeDomCapture')
const EyesUtils = require('./EyesUtils')
const EyesCore = require('./EyesCore')
const ElementNotFoundError = require('../errors/ElementNotFoundError')

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesDriver')<TDriver, TElement, TSelector>} EyesDriver
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesElement')<TDriver, TElement, TSelector>} EyesElement
 */

/**
 * @template TElement, TSelector
 * @typedef {import('../fluent/DriverCheckSettings')<TElement, TSelector>} CheckSettings
 */

/**
 * @template TDriver
 * @template TElement
 * @template TSelector
 * @extends {EyesCore<TDriver, TElement, TSelector>}
 */
class EyesClassic extends EyesCore {
  /**
   * Create a specialized version of this class
   * @template TDriver, TElement, TSelector
   * @param {Object} implementations - implementations of related classes
   * @param {string} implementations.agentId - base agent id
   * @param {EyesWrappedDriverCtor<TDriver, TElement, TSelector>} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
   * @param {EyesWrappedElementCtor<TDriver, TElement, TSelector> & EyesWrappedElementStatics<TDriver, TElement, TSelector>} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
   * @param {CheckSettings<TElement, TSelector>} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
   * @return {new (...args: ConstructorParameters<typeof EyesClassic>) => EyesClassic<TDriver, TElement, TSelector>} specialized version of this class
   */
  static specialize({agentId, spec}) {
    return class extends EyesClassic {
      static get spec() {
        return spec
      }
      get spec() {
        return spec
      }
      /**
       * @return {string} base agent id
       */
      getBaseAgentId() {
        return agentId
      }
    }
  }
  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   * @param {string|boolean|ClassicRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {ClassicRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
   */
  constructor(serverUrl, isDisabled = false, runner = new ClassicRunner()) {
    super(serverUrl, isDisabled)
    /** @private */
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)

    /** @private @type {boolean} */
    this._checkFullFrameOrElement = false
    /** @private @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined
    /** @private @type {Region} */
    this._regionToCheck = null
    /** @private @type {PositionProvider} */
    this._targetPositionProvider = undefined
    /** @private @type {Region} */
    this._effectiveViewport = Region.EMPTY
    /** @private @type {string}*/
    this._domUrl
    /** @private @type {EyesScreenshotFactory} */
    this._screenshotFactory = undefined
    /** @private @type {EyesWrappedElement<TDriver, TElement, TSelector>} */
    this._scrollRootElement = undefined
    /** @private @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }
  /**
   * @template {TDriver} CDriver
   * @param {CDriver} driver - driver object for the specific framework
   * @param {String} [appName] - application name
   * @param {String} [testName] - test name
   * @param {RectangleSize|{width: number, height: number}} [viewportSize] - viewport size
   * @param {SessionType} [sessionType] - type of test (e.g.,  standard test / visual performance test).
   * @return {Promise<CDriver & EyesWrappedDriver<TDriver, TElement, TSelector>>}
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver')

    this._driver = await this.spec.newDriver(this._logger, driver).init()
    this._context = this._driver.currentContext

    this._configuration.setAppName(
      TypeUtils.getOrDefault(appName, this._configuration.getAppName()),
    )
    this._configuration.setTestName(
      TypeUtils.getOrDefault(testName, this._configuration.getTestName()),
    )
    this._configuration.setViewportSize(
      TypeUtils.getOrDefault(viewportSize, this._configuration.getViewportSize()),
    )
    this._configuration.setSessionType(
      TypeUtils.getOrDefault(sessionType, this._configuration.getSessionType()),
    )

    if (!this._configuration.getViewportSize()) {
      const vs = await this._driver.getViewportSize()
      this._configuration.setViewportSize(vs)
    }

    if (this._isDisabled) {
      this._logger.verbose('Ignored')
      return driver
    }

    if (this._driver.isMobile) {
      // set viewportSize to null if browser is mobile
      this._configuration.setViewportSize(null)
    }

    await this._initCommon()

    this._screenshotFactory = new EyesScreenshotFactory(this._logger, this)

    this._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(
      this._userAgent,
      this,
      this._logger,
    )

    await this.openBase(
      this._configuration.getAppName(),
      this._configuration.getTestName(),
      this._configuration.getViewportSize(),
      this._configuration.getSessionType(),
    )
  }
  async _check(checkSettings, closeAfterMatch = false, throwEx = true) {
    checkSettings.ignoreCaret(checkSettings.getIgnoreCaret() || this.getIgnoreCaret())
    this._checkSettings = checkSettings // TODO remove

    return this._checkPrepare(checkSettings, async () => {
      if (checkSettings.getTargetRegion()) {
        if (this._stitchContent) {
          return this._checkFullRegion(
            checkSettings,
            checkSettings.getTargetRegion(),
            closeAfterMatch,
            throwEx,
          )
        } else {
          return this._checkRegion(
            checkSettings,
            checkSettings.getTargetRegion(),
            closeAfterMatch,
            throwEx,
          )
        }
      } else if (checkSettings.getTargetElement()) {
        const targetElement = await this._context.element(checkSettings.getTargetElement())
        if (!targetElement) throw new ElementNotFoundError() // TODO move in a proper place
        if (this._driver.isNative) process.env.APPLITOOLS_SKIP_MOBILE_NATIVE_SCREENSHOT_HOOK = true
        if (this._stitchContent) {
          return this._checkFullElement(checkSettings, targetElement, closeAfterMatch, throwEx)
        } else {
          return this._checkElement(checkSettings, targetElement, closeAfterMatch, throwEx)
        }
      } else if (checkSettings.getContext()) {
        if (this._stitchContent) {
          return this._checkFullFrame(checkSettings, closeAfterMatch, throwEx)
        } else {
          return this._checkFrame(checkSettings, closeAfterMatch, throwEx)
        }
      } else {
        if (!this._stitchContent) {
          this._context = this._driver.mainContext
          this._regionToCheck = new Region(
            await this._context.getInnerOffset(),
            await this._driver.getViewportSize(),
          )
        }
        const source = await this._driver.getUrl()
        return this.checkWindowBase(
          new NullRegionProvider(),
          checkSettings.getName(),
          false,
          checkSettings,
          source,
          closeAfterMatch,
          throwEx,
        )
      }
    })
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {Function} operation - check operation
   * @return {Promise<MatchResult>}
   */
  async _checkPrepare(checkSettings, operation) {
    if (this._driver.isNative) {
      await this._context.main.setScrollRootElement(this._scrollRootElement)
      await this._context.setScrollRootElement(checkSettings.getScrollRootElement())
      if (checkSettings.getContext()) {
        this._context = await this._context.context(checkSettings.getContext())
      }
      return operation()
    }
    this._stitchContent = checkSettings.getStitchContent()
    // sync stored frame chain with actual browsing context
    this._context = await this._driver.refreshContexts()

    await this._context.main.setScrollRootElement(this._scrollRootElement)
    await this._context.setScrollRootElement(checkSettings.getScrollRootElement())

    const originalContext = this._context

    if (checkSettings.getContext()) {
      this._context = await this._context.context(checkSettings.getContext())
    }

    const positionProvider = this._createPositionProvider(
      await this._context.main.getScrollRootElement(),
      this._context.main,
    )

    this.setPositionProvider(positionProvider)

    const shouldHideScrollbars = !this._driver.isMobile && this._configuration.getHideScrollbars()

    for (const context of this._context.path) {
      const scrollRootElement = await context.getScrollRootElement()
      if (scrollRootElement) {
        await scrollRootElement.preservePosition(positionProvider)
        if (shouldHideScrollbars) {
          await scrollRootElement.hideScrollbars()
        }
      }
    }

    try {
      return await operation()
    } finally {
      let currentContext = this._context
      while (currentContext) {
        const scrollRootElement = await currentContext.getScrollRootElement()
        if (scrollRootElement) {
          if (shouldHideScrollbars) {
            await scrollRootElement.restoreScrollbars()
          }
          await scrollRootElement.restorePosition(positionProvider)
        }
        currentContext = currentContext.parent
      }
      this._context = await originalContext.focus()
      this._stitchContent = false
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {Region} targetRegion - region to check
   * @return {Promise<MatchResult>}
   */
  async _checkRegion(checkSettings, targetRegion, closeAfterMatch, throwEx) {
    try {
      this._regionToCheck = targetRegion

      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._context,
        this._positionProviderHandler.get(),
        this._regionToCheck,
      )

      const source = await this._driver.getUrl()
      return super.checkWindowBase(
        new RegionProvider(this._regionToCheck),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
        closeAfterMatch,
        throwEx,
      )
    } finally {
      this._regionToCheck = null
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {Region} targetRegion - region to check
   * @return {Promise<MatchResult>}
   */
  async _checkFullRegion(checkSettings, targetRegion, closeAfterMatch, throwEx) {
    this._shouldCheckFullRegion = true

    this._regionToCheck = new Region(targetRegion)
    const remainingOffset = await EyesUtils.ensureRegionVisible(
      this._logger,
      this._context,
      this._positionProviderHandler.get(),
      this._regionToCheck,
    )

    this._targetPositionProvider = this._createPositionProvider(
      await this._context.getScrollRootElement(),
    )

    this._regionFullArea = new Region(
      this._regionToCheck
        .getLocation()
        .offsetNegative(remainingOffset)
        .offsetByLocation(await this._context.getLocationInViewport()),
      this._regionToCheck.getSize(),
    )

    this._logger.verbose('Region to check: ' + this._regionToCheck)
    try {
      const source = await this._driver.getUrl()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
        closeAfterMatch,
        throwEx,
      )
    } finally {
      this._regionToCheck = null
      this._targetPositionProvider = null
      this._shouldCheckFullRegion = false
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {EyesWrappedElement<TDriver, TElement, TSelector>} targetElement - element to check
   * @return {Promise<MatchResult>}
   */
  async _checkElement(checkSettings, targetElement, closeAfterMatch, throwEx) {
    try {
      this._regionToCheck = await targetElement.getRect()

      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._context,
        this._positionProviderHandler.get(),
        this._regionToCheck,
      )

      const source = await this._driver.getUrl()
      return await super.checkWindowBase(
        new RegionProvider(this._regionToCheck),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
        closeAfterMatch,
        throwEx,
      )
    } finally {
      this._regionToCheck = null
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {EyesWrappedElement} targetElement - element to check
   * @return {Promise<MatchResult>}
   */
  async _checkFullElement(checkSettings, targetElement, closeAfterMatch, throwEx) {
    this._shouldCheckFullRegion = true

    if (this._configuration.getHideScrollbars()) {
      await targetElement.hideScrollbars()
    }

    this._regionToCheck = await targetElement.getClientRect()
    this._logger.verbose('TElement region: ' + this._regionToCheck)

    const remainingOffset = await EyesUtils.ensureRegionVisible(
      this._logger,
      this._context,
      this._positionProviderHandler.get(),
      this._regionToCheck,
    )

    const stitchMode = this._configuration.getStitchMode()
    if (stitchMode === StitchMode.CSS) {
      this._targetPositionProvider = new CssTranslateElementPositionProvider(
        this._logger,
        this._context,
        targetElement,
      )
      this._regionFullArea = null
      await targetElement.preservePosition(this._targetPositionProvider)
    } else if (await EyesUtils.isScrollable(this._logger, this._context, targetElement)) {
      this._targetPositionProvider = new ScrollElementPositionProvider(
        this._logger,
        this._context,
        targetElement,
      )
      this._regionFullArea = null
    } else {
      this._targetPositionProvider = this._createPositionProvider(
        await this._context.getScrollRootElement(),
      )
      this._regionFullArea = new Region(
        this._regionToCheck.getLocation().offsetNegative(remainingOffset),
        // .offsetNegative(await this._context.getInnerOffset()),
        this._regionToCheck.getSize(),
      )
    }

    try {
      const source = await this._driver.getUrl()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
        closeAfterMatch,
        throwEx,
      )
    } finally {
      this._regionToCheck = null
      this._regionFullArea = null
      await targetElement.restorePosition(this._targetPositionProvider)
      this._targetPositionProvider = null
      await targetElement.restoreScrollbars()
      this._shouldCheckFullRegion = false
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @return {Promise<MatchResult>}
   */
  async _checkFrame(checkSettings, closeAfterMatch, throwEx) {
    const targetElement = await this._context.getFrameElement()
    const originalContext = this._context
    this._context = this._context.parent
    try {
      return await this._checkElement(checkSettings, targetElement, closeAfterMatch, throwEx)
    } finally {
      this._context = await originalContext.focus()
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @return {Promise<MatchResult>}
   */
  async _checkFullFrame(checkSettings, closeAfterMatch, throwEx) {
    this._shouldCheckFullRegion = true
    await EyesUtils.ensureRegionVisible(
      this._logger,
      this._context,
      this._positionProviderHandler.get(),
      new Region(Location.ZERO, await this._context.getClientSize()),
    )

    this._targetPositionProvider = this._createPositionProvider(
      await this._context.getScrollRootElement(),
    )

    // we don't need to specify it explicitly since this is the same as entire size
    this._regionFullArea = null
    this._regionToCheck = new Region(
      Location.ZERO,
      await this._context.getClientSize(),
      CoordinatesType.CONTEXT_RELATIVE,
    )

    const effectiveSize = await this._context.getEffectiveSize()
    this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
    if (!this._effectiveViewport.isSizeEmpty()) {
      this._regionToCheck.intersect(this._effectiveViewport)
    }

    this._logger.verbose('TElement region: ' + this._regionToCheck)

    try {
      const source = await this._driver.getUrl()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
        closeAfterMatch,
        throwEx,
      )
    } finally {
      this._regionToCheck = null
      this._targetPositionProvider = null
      this._shouldCheckFullRegion = false
    }
  }
  /**
   * @private
   * @param {EyesWrappedElement<TDriver, TElement, Selecotr>} scrollRootElement - scroll root element
   * @return {PositionProvider}
   */
  _createPositionProvider(scrollRootElement, context = this._context) {
    const stitchMode = this._configuration.getStitchMode()
    this._logger.verbose('initializing position provider. stitchMode:', stitchMode)

    return stitchMode === StitchMode.CSS
      ? new CssTranslatePositionProvider(this._logger, context, scrollRootElement)
      : new ScrollPositionProvider(this._logger, context, scrollRootElement)
  }
  /**
   * Create a screenshot of the specified in check method region
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()')

    let activeElement = null
    if (this._configuration.getHideCaret() && !this._driver.isNative) {
      activeElement = await EyesUtils.blurElement(this._logger, this._context)
    }

    try {
      if (this._shouldCheckFullRegion) {
        return await this._getFullRegionScreenshot()
      } else if (this._configuration.getForceFullPageScreenshot() || this._stitchContent) {
        return await this._getFullPageScreenshot()
      } else {
        return await this._getViewportScreenshot()
      }
    } finally {
      if (this._configuration.getHideCaret() && activeElement) {
        await EyesUtils.focusElement(this._logger, this._context, activeElement)
      }
      this._logger.verbose('Done!')
    }
  }
  /**
   * @override
   */
  async getScreenshotUrl() {
    return undefined
  }
  /**
   * Create a full region screenshot
   * @return {Promise<EyesScreenshot>}
   */
  async _getFullRegionScreenshot() {
    this._logger.verbose('Check full frame/element requested')

    const scaleProviderFactory = await this._updateScalingParams()
    if (!this._targetPositionProvider) {
      this._targetPositionProvider = this._createPositionProvider(
        await this._context.getScrollRootElement(),
      )
    }

    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._context,
      this._targetPositionProvider.scrollRootElement,
    )
    const fullPageCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this._configuration.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      originProvider,
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider,
    )

    await this._targetPositionProvider.markScrollRootElement()
    const screenshot = await fullPageCapture.getStitchedRegion(
      this._regionToCheck,
      this._regionFullArea,
      this._targetPositionProvider,
    )

    this._imageLocation = screenshot.imageLocation

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(this._logger, this, screenshot.image)
  }
  /**
   * Create a full page screenshot
   * @return {Promise<EyesScreenshot>}
   */
  async _getFullPageScreenshot() {
    this._logger.verbose('Full page screenshot requested.')

    const scaleProviderFactory = await this._updateScalingParams()
    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._context.main,
      await this._context.main.getScrollRootElement(),
    )
    const fullCapture = new FullPageCaptureAlgorithm(
      this._logger,
      this._regionPositionCompensation,
      this._configuration.getWaitBeforeScreenshots(),
      this._debugScreenshotsProvider,
      this._screenshotFactory,
      originProvider,
      scaleProviderFactory,
      this._cutProviderHandler.get(),
      this._configuration.getStitchOverlap(),
      this._imageProvider,
    )
    const positionProvider = this._positionProviderHandler.get()

    await positionProvider.markScrollRootElement()

    let scrollRootElement = positionProvider.scrollRootElement
    if (!scrollRootElement) {
      scrollRootElement = await this._context.main.getScrollRootElement()
    }

    const region = await scrollRootElement.getClientRect()
    const screenshot = await fullCapture.getStitchedRegion(region, null, positionProvider)

    this._imageLocation = screenshot.imageLocation

    const originalFramePosition = await this._context.main.getInnerOffset()
    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(
      this._logger,
      this,
      screenshot.image,
      null,
      originalFramePosition,
    )
  }

  /**
   * @param {boolean} [throwEx=true] - true if need to throw exception for unresolved tests, otherwise false
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    let isErrorCaught = false
    this._closePromise = super
      .close(true)
      .catch(err => {
        isErrorCaught = true
        return err
      })
      .then(results => {
        if (this._runner) {
          this._runner._allTestResult.push(results)
        }
        if (isErrorCaught) {
          if (throwEx || !results.getTestResults) throw results
          else return results.getTestResults()
        }
        return results
      })

    return this._closePromise
  }
  /**
   * @private
   */
  async tryCaptureDom() {
    this._logger.verbose('Getting window DOM...')
    const positionProvider = this._positionProviderHandler.get()
    let originalPosition
    try {
      if (
        !this._driver.isNative &&
        !this._shouldCheckFullRegion &&
        (this._configuration.getForceFullPageScreenshot() || this._stitchContent)
      ) {
        originalPosition = await positionProvider.getState()
        await positionProvider.setPosition(Location.ZERO)
      }
      return await takeDomCapture(this._logger, this._driver.mainContext)
    } catch (ignored) {
      return ''
    } finally {
      if (originalPosition) {
        await positionProvider.setPosition(originalPosition)
      }
    }
  }
  /**
   * @override
   */
  async getAppEnvironment() {
    const appEnv = await super.getAppEnvironment()

    if (!appEnv._deviceInfo && this._driver.deviceName) {
      appEnv.setDeviceInfo(this._driver.deviceName)
    }

    if (!appEnv._os && this._driver.isNative) {
      let os = this._driver.platformName
      if (this._driver.platformVersion) {
        os += ` ${this._driver.platformVersion}`
      }
      if (os) {
        appEnv.setOs(os)
      }
    }
    return appEnv
  }
  /**
   * Set the failure report.
   * @param {FailureReports} mode Use one of the values in FailureReports.
   */
  setFailureReport(mode) {
    if (mode === FailureReports.IMMEDIATE) {
      this._failureReportOverridden = true
      mode = FailureReports.ON_CLOSE
    }

    EyesCore.prototype.setFailureReport.call(this, mode)
  }
  /**
   * @override
   * @return {boolean}
   */
  getSendDom() {
    return !this._driver.isNative && super.getSendDom()
  }
  /**
   * @private
   */
  getImageLocation() {
    if (this._imageLocation) {
      return new Location(
        Math.round(this._imageLocation.getX()),
        Math.round(this._imageLocation.getY()),
      )
    }
    return Location.ZERO
  }
  /**
   * @private
   */
  async getInferredEnvironment() {
    try {
      const userAgent = await this._driver.userAgentString
      return userAgent ? 'useragent:' + userAgent : userAgent
    } catch (err) {
      return null
    }
  }

  // TODO Do we need this method?
  /**
   * @param {By} locator
   * @returns {Region}
   */
  async getRegionByLocator(locator) {
    const element = await this._driver.element(locator)
    const rect = await element.getElementRect()
    return rect
  }
}

module.exports = EyesClassic
