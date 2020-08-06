'use strict'
const StitchMode = require('./config/StitchMode')
const TypeUtils = require('./utils/TypeUtils')
const ArgumentGuard = require('./utils/ArgumentGuard')
const CoordinatesType = require('./geometry/CoordinatesType')
const Region = require('./geometry/Region')
const Location = require('./geometry/Location')
const FailureReports = require('./FailureReports')
const MatchResult = require('./match/MatchResult')
const FullPageCaptureAlgorithm = require('./capture/FullPageCaptureAlgorithm')
const EyesScreenshot = require('./capture/EyesScreenshotNew')
const EyesScreenshotFactory = require('./capture/EyesScreenshotFactory')
const NullRegionProvider = require('./positioning/NullRegionProvider')
const RegionProvider = require('./positioning/RegionProvider')
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory')
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider')
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider')
const CssTranslateElementPositionProvider = require('./positioning/CssTranslateElementPositionProvider')
const ScrollElementPositionProvider = require('./positioning/ScrollElementPositionProvider')
const ClassicRunner = require('./runner/ClassicRunner')
const DomCapture = require('./DomCapture')
const EyesUtils = require('./EyesUtils')
const EyesCore = require('./EyesCore')

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
 * @typedef {import('./wrappers/EyesWrappedDriver').EyesWrappedDriverCtor<TDriver, TElement, TSelector>} EyesWrappedDriverCtor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesWrappedElement').EyesWrappedElementCtor<TDriver, TElement, TSelector>} EyesWrappedElementCtor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesWrappedElement').EyesWrappedElementStatics<TDriver, TElement, TSelector>} EyesWrappedElementStatics
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesJsExecutor')<TDriver, TElement, TSelector>} EyesJsExecutor
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesBrowsingContext')<TDriver, TElement, TSelector>} EyesBrowsingContext
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesElementFinder')<TDriver, TElement, TSelector>} EyesElementFinder
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./wrappers/EyesDriverController')<TDriver, TElement, TSelector>} EyesDriverController
 */

/**
 * @template TElement, TSelector
 * @typedef {import('./fluent/DriverCheckSettings')<TElement, TSelector>} CheckSettings
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
   * @internal
   * @template TDriver, TElement, TSelector
   * @param {Object} implementations - implementations of related classes
   * @param {string} implementations.agentId - base agent id
   * @param {EyesWrappedDriverCtor<TDriver, TElement, TSelector>} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
   * @param {EyesWrappedElementCtor<TDriver, TElement, TSelector> & EyesWrappedElementStatics<TDriver, TElement, TSelector>} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
   * @param {CheckSettings<TElement, TSelector>} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
   * @return {new (...args: ConstructorParameters<typeof EyesClassic>) => EyesClassic<TDriver, TElement, TSelector>} - specialized version of this class
   */
  static specialize({agentId, WrappedDriver, WrappedElement, CheckSettings}) {
    return class extends EyesClassic {
      /**
       * @return {typeof WrappedDriver} implementation for {@link EyesWrappedDriver}
       */
      static get WrappedDriver() {
        return WrappedDriver
      }
      /**
       * @return {typeof WrappedElement} implementation for {@link EyesWrappedElement}
       */
      static get WrappedElement() {
        return WrappedElement
      }
      /**
       * @return {typeof CheckSettings} specialized version of {@link DriverCheckSettings}
       */
      static get CheckSettings() {
        return CheckSettings
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

    /** @private */
    this._imageRotationDegrees = 0
    /** @private */
    this._automaticRotation = true
    /** @private @type {boolean} */
    this._isLandscape = false
    /** @private @type {boolean} */
    this._checkFullFrameOrElement = false

    /** @private @type {String} */
    this._originalDefaultContentOverflow = false
    /** @private @type {String} */
    this._originalFrameOverflow = false

    /** @private @type {String} */
    this._originalOverflow = null
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
    this._scrollRootElement = null
    /** @private @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }
  /**
   * @signature `open(driver, appName, testName, viewportSize)`
   * @sigparam {TDriver} driver
   * @sigparam {String} [appName] - application name
   * @sigparam {String} [testName] - test name
   * @sigparam {RectangleSize|{width: number, height: number}} [viewportSize] - viewport size
   * @sigreturn {Promise<EyesWebDriver>}
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

    this._logger.verbose('Running using Webdriverio module')

    this._driver = new this.constructor.WrappedDriver(this._logger, driver)
    this._executor = this._driver.executor
    this._finder = this._driver.finder
    this._context = this._driver.context
    this._controller = this._driver.controller

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
      const vs = await EyesUtils.getTopContextViewportSize(this._logger, this._driver)
      this._configuration.setViewportSize(vs)
    }

    if (this._isDisabled) {
      this._logger.verbose('Ignored')
      return driver
    }

    if (await this._controller.isMobile()) {
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

    return this._driver
  }
  /**
   * @signature `check(name, checkSettings)`
   * @sigparam {string} checkSettings
   * @sigparam {CheckSettings<TElement, TSelector>} name   
   * @signature `check(checkSettings)`   
   * @param {string|CheckSettings<TElement, TSelector>} [nameOrCheckSettings] - name of the test case
   * @param {CheckSettings<TElement, TSelector>} [checkSettings] - check settings for the described test case
   * @returns {Promise<MatchResult>}
   */
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

    checkSettings = new this.constructor.CheckSettings(checkSettings)

    if (TypeUtils.isString(nameOrCheckSettings)) {
      checkSettings.withName(nameOrCheckSettings)
    }

    this._logger.verbose(`check(${nameOrCheckSettings}, checkSettings) - begin`)

    checkSettings.ignoreCaret(checkSettings.getIgnoreCaret() || this.getIgnoreCaret())
    this._checkSettings = checkSettings // TODO remove

    return this._checkPrepare(checkSettings, async () => {
      const targetRegion = checkSettings.getTargetRegion()
      const targetElement = checkSettings.targetElement
      if (targetRegion) {
        if (this._stitchContent) {
          return this._checkFullRegion(checkSettings, targetRegion)
        } else {
          return this._checkRegion(checkSettings, targetRegion)
        }
      } else if (targetElement) {
        await targetElement.init(this._driver)
        if (this._stitchContent) {
          return this._checkFullElement(checkSettings, targetElement)
        } else {
          return this._checkElement(checkSettings, targetElement)
        }
      } else if (checkSettings.frameChain.length > 0) {
        if (this._stitchContent) {
          return this._checkFullFrame(checkSettings)
        } else {
          return this._checkFrame(checkSettings)
        }
      } else {
        const source = await this._controller.getSource()
        return this.checkWindowBase(
          new NullRegionProvider(),
          checkSettings.getName(),
          false,
          checkSettings,
          source,
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
    if (await this._controller.isNative()) return operation()
    this._stitchContent = checkSettings.getStitchContent()
    // sync stored frame chain with actual browsing context
    await this._context.framesRefresh()
    const originalFrameChain = this._context.frameChain
    const appendFrameChain = checkSettings.frameChain

    const shouldHideScrollbars =
      !(await this._controller.isMobile()) &&
      (this._configuration.getHideScrollbars() ||
        (this._configuration.getStitchMode() === StitchMode.CSS && this._stitchContent))

    if (this._scrollRootElement) {
      this._context.topContext.scrollRootElement = this._scrollRootElement
    }

    const scrollRootElement = checkSettings.getScrollRootElement()
    if (scrollRootElement) {
      await scrollRootElement.init(this._driver)
      if (originalFrameChain.isEmpty) {
        this._context.topContext.scrollRootElement = scrollRootElement
      } else {
        this._context.frameChain.current.scrollRootElement = scrollRootElement
      }
    }

    await this._context.frameDefault()

    if (this._context.topContext.scrollRootElement) {
      await this._context.topContext.scrollRootElement.init(this._driver)
    } else {
      this._context.topContext.scrollRootElement = await this._finder.findElement({
        type: 'css',
        selector: 'html',
      })
    }

    const positionProvider = this._createPositionProvider(
      this._context.topContext.scrollRootElement,
    )
    this.setPositionProvider(positionProvider)

    await this._context.topContext.scrollRootElement.preservePosition(positionProvider)
    if (shouldHideScrollbars) {
      await this._context.topContext.scrollRootElement.hideScrollbars()
    }

    // If we changing a frame (hiding scrollbars in this case) then we need to switch to the frame by a reference
    const absoluteFrameChain = shouldHideScrollbars
      ? Array.from(originalFrameChain, frame => frame.toReference()).concat(appendFrameChain)
      : Array.from(originalFrameChain).concat(appendFrameChain)

    for (const frame of absoluteFrameChain) {
      await this._context.frame(frame)
      if (shouldHideScrollbars) {
        await frame.hideScrollbars()
      }
      await frame.preservePosition(positionProvider)
    }

    try {
      return await operation()
    } finally {
      const currentFrameChain = this._context.frameChain
      for (let index = currentFrameChain.size - 1; index >= 0; --index) {
        const frame = currentFrameChain.frameAt(index)
        await frame.restorePosition(positionProvider)
        if (shouldHideScrollbars) {
          await frame.restoreScrollbars()
        }
        await this._context.frameParent()
      }
      await this._context.topContext.scrollRootElement.restorePosition(positionProvider)
      await this._context.topContext.scrollRootElement.restoreScrollbars()
      await this._context.frames(originalFrameChain)
      this._stitchContent = false
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @param {Region} targetRegion - region to check
   * @return {Promise<MatchResult>}
   */
  async _checkRegion(checkSettings, targetRegion) {
    try {
      this._regionToCheck = targetRegion
      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._driver,
        this._positionProviderHandler.get(),
        this._regionToCheck,
      )

      const source = await this._controller.getSource()
      return super.checkWindowBase(
        new RegionProvider(this._regionToCheck),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
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
  async _checkFullRegion(checkSettings, targetRegion) {
    this._shouldCheckFullRegion = true

    this._regionToCheck = new Region(targetRegion)
    const remainingOffset = await EyesUtils.ensureRegionVisible(
      this._logger,
      this._driver,
      this._positionProviderHandler.get(),
      this._regionToCheck,
    )

    const frameChain = this._context.frameChain
    const scrollRootElement = !frameChain.isEmpty
      ? frameChain.current.scrollRootElement
      : this._context.topContext.scrollRootElement
    this._targetPositionProvider = this._createPositionProvider(scrollRootElement)

    this._regionFullArea = new Region(
      this._regionToCheck.getLocation().offsetNegative(remainingOffset),
      this._regionToCheck.getSize(),
    )
    // const effectiveViewport = new Region(this._effectiveViewport)

    // if (!frameChain.isEmpty) {
    //   const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
    //   effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
    // }
    // if (!effectiveViewport.isSizeEmpty()) {
    //   this._regionToCheck.intersect(
    //     new Region(this._regionToCheck.getLocation(), effectiveViewport),
    //   )
    // }

    this._logger.verbose('Region to check: ' + this._regionToCheck)
    try {
      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
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
  async _checkElement(checkSettings, targetElement) {
    try {
      this._regionToCheck = await targetElement.getRect()

      await EyesUtils.ensureRegionVisible(
        this._logger,
        this._driver,
        this._positionProviderHandler.get(),
        this._regionToCheck,
      )

      const source = await this._controller.getSource()
      return super.checkWindowBase(
        new RegionProvider(this._regionToCheck),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
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
  async _checkFullElement(checkSettings, targetElement) {
    this._shouldCheckFullRegion = true

    if (this._configuration.getHideScrollbars()) {
      await targetElement.hideScrollbars()
    }

    this._regionToCheck = await targetElement.getClientRect()
    this._logger.verbose('TElement region: ' + this._regionToCheck)

    const remainingOffset = await EyesUtils.ensureRegionVisible(
      this._logger,
      this._driver,
      this._positionProviderHandler.get(),
      this._regionToCheck,
    )

    const stitchMode = this._configuration.getStitchMode()
    if (stitchMode === StitchMode.CSS) {
      this._targetPositionProvider = new CssTranslateElementPositionProvider(
        this._logger,
        this._executor,
        targetElement,
      )
      this._regionFullArea = null
      await targetElement.preservePosition(this._targetPositionProvider)
    } else if (await EyesUtils.isScrollable(this._logger, this._executor, targetElement)) {
      this._targetPositionProvider = new ScrollElementPositionProvider(
        this._logger,
        this._executor,
        targetElement,
      )
      this._regionFullArea = null
    } else {
      const frameChain = this._context.frameChain
      const scrollRootElement = !frameChain.isEmpty
        ? frameChain.current.scrollRootElement
        : this._context.topContext.scrollRootElement
      this._targetPositionProvider = this._createPositionProvider(scrollRootElement)
      this._regionFullArea = new Region(
        this._regionToCheck.getLocation().offsetNegative(remainingOffset),
        this._regionToCheck.getSize(),
      )
    }

    try {
      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
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
  async _checkFrame(checkSettings) {
    const targetFrame = this._context.frameChain.current
    const targetElement = targetFrame.element
    await this._context.frameParent()
    try {
      return await this._checkElement(checkSettings, targetElement)
    } finally {
      await this._context.frame(targetFrame)
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings - check settings for the described test case
   * @return {Promise<MatchResult>}
   */
  async _checkFullFrame(checkSettings) {
    this._shouldCheckFullRegion = true
    await EyesUtils.ensureFrameVisible(
      this._logger,
      this._context,
      this._positionProviderHandler.get(),
    )

    const frameChain = this._context.frameChain
    const targetFrame = frameChain.current
    const scrollRootElement = targetFrame.scrollRootElement
    this._targetPositionProvider = this._createPositionProvider(scrollRootElement)

    // we don't need to specify it explicitly since this is the same as entire size
    this._regionFullArea = null
    this._regionToCheck = new Region(
      Location.ZERO,
      targetFrame.innerSize,
      CoordinatesType.CONTEXT_RELATIVE,
    )

    const effectiveSize = frameChain.getCurrentFrameEffectiveSize()
    this._effectiveViewport.intersect(new Region(Location.ZERO, effectiveSize))
    if (!this._effectiveViewport.isSizeEmpty()) {
      this._regionToCheck.intersect(this._effectiveViewport)
    }

    this._logger.verbose('TElement region: ' + this._regionToCheck)

    try {
      const source = await this._controller.getSource()
      return await super.checkWindowBase(
        new NullRegionProvider(),
        checkSettings.getName(),
        false,
        checkSettings,
        source,
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
  _createPositionProvider(scrollRootElement) {
    const stitchMode = this._configuration.getStitchMode()
    this._logger.verbose('initializing position provider. stitchMode:', stitchMode)

    return stitchMode === StitchMode.CSS
      ? new CssTranslatePositionProvider(this._logger, this._executor, scrollRootElement)
      : new ScrollPositionProvider(this._logger, this._executor, scrollRootElement)
  }
  /**
   * Create a screenshot of the specified in check method region
   * @return {Promise<EyesScreenshot>}
   */
  async getScreenshot() {
    this._logger.verbose('getScreenshot()')

    const isNative = await this._controller.isNative()
    let activeElement = null
    if (this._configuration.getHideCaret() && !isNative) {
      activeElement = await EyesUtils.blurElement(this._logger, this._executor)
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
        await EyesUtils.focusElement(this._logger, this._executor, activeElement)
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
      const frameChain = this._context.frameChain
      const scrollRootElement = !frameChain.isEmpty
        ? frameChain.current.scrollRootElement
        : this._context.topContext.scrollRootElement
      this._targetPositionProvider = this._createPositionProvider(scrollRootElement)
    }
    const originProvider = new ScrollPositionProvider(
      this._logger,
      this._executor,
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
    const fullRegionImage = await fullPageCapture.getStitchedRegion(
      this._regionToCheck,
      this._regionFullArea,
      this._targetPositionProvider,
    )

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromFrameSize(
      this._logger,
      this,
      fullRegionImage,
      fullRegionImage.getSize(),
    )
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
      this._executor,
      this._context.topContext.scrollRootElement,
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
    const fullPageImage = await this._context.framesSwitchAndReturn(null, async () => {
      await positionProvider.markScrollRootElement()

      let scrollRootElement = positionProvider.scrollRootElement
      if (!scrollRootElement) {
        scrollRootElement = await this._finder.findElement({type: 'css', selector: 'html'})
      }
      const location = await scrollRootElement.getLocation()
      const [borderLeftWidth, borderTopWidth] = await scrollRootElement.getCssProperty(
        'border-left-width',
        'border-top-width',
      )
      const [clientWidth, clientHeight] = await scrollRootElement.getProperty(
        'clientWidth',
        'clientHeight',
      )
      const region = new Region(
        Math.round(location.getX() + Number.parseFloat(borderLeftWidth)),
        Math.round(location.getY() + Number.parseFloat(borderTopWidth)),
        Math.round(clientWidth),
        Math.round(clientHeight),
      )
      return fullCapture.getStitchedRegion(region, null, positionProvider)
    })

    const frameChain = this._context.frameChain
    const originalFramePosition = !frameChain.isEmpty
      ? frameChain.first.parentScrollLocation
      : Location.ZERO

    this._logger.verbose('Building screenshot object...')
    return EyesScreenshot.fromScreenshotType(
      this._logger,
      this,
      fullPageImage,
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
    try {
      this._logger.verbose('Getting window DOM...')
      return await DomCapture.getFullWindowDom(this._logger, this._driver)
    } catch (ignored) {
      return ''
    }
  }
  /**
   * @override
   */
  async getAppEnvironment() {
    const appEnv = await super.getAppEnvironment()

    if (!appEnv._os) {
      const os = await this._controller.getMobileOS()
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
  async getSendDom() {
    return !(await this._controller.isNative()) && super.getSendDom()
  }
  /**
   * @private
   */
  getImageLocation() {
    if (this._regionToCheck) {
      return this._regionToCheck.getLocation()
    }
    return Location.ZERO
  }
  /**
   * @private
   */
  async getInferredEnvironment() {
    try {
      const userAgent = await this._controller.getUserAgent()
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
    const element = await this._finder.findElement(locator)
    const elementSize = await element.getSize()
    const point = await element.getLocation()
    return new Region(point.x, point.y, elementSize.width, elementSize.height)
  }
}

module.exports = EyesClassic
