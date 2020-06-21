'use strict'
const {StitchMode} = require('./config/StitchMode')
const {TypeUtils} = require('./utils/TypeUtils')
const {ArgumentGuard} = require('./utils/ArgumentGuard')
const {CoordinatesType} = require('./geometry/CoordinatesType')
const {Region} = require('./geometry/Region')
const {Location} = require('./geometry/Location')
const {RectangleSize} = require('./geometry/RectangleSize')
const {UserAgent} = require('./useragent/UserAgent')
const {ReadOnlyPropertyHandler} = require('./handler/ReadOnlyPropertyHandler')
const {SimplePropertyHandler} = require('./handler/SimplePropertyHandler')
const {FailureReports} = require('./FailureReports')
const {TestFailedError} = require('./errors/TestFailedError')
const {MatchResult} = require('./match/MatchResult')
const {FullPageCaptureAlgorithm} = require('./capture/FullPageCaptureAlgorithm')
const EyesScreenshot = require('./capture/EyesScreenshotNew')
const EyesScreenshotFactory = require('./capture/EyesScreenshotFactory')
const ImageProviderFactory = require('./capture/ImageProviderFactory')
const NullRegionProvider = require('./positioning/NullRegionProvider')
const RegionProvider = require('./positioning/RegionProvider')
const {NullCutProvider} = require('./cropping/NullCutProvider')
const {NullScaleProvider} = require('./scaling/NullScaleProvider')
const {ScaleProviderIdentityFactory} = require('./scaling/ScaleProviderIdentityFactory')
const {ContextBasedScaleProviderFactory} = require('./scaling/ContextBasedScaleProviderFactory')
const {FixedScaleProviderFactory} = require('./scaling/FixedScaleProviderFactory')
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory')
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider')
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider')
const CssTranslateElementPositionProvider = require('./positioning/CssTranslateElementPositionProvider')
const ScrollElementPositionProvider = require('./positioning/ScrollElementPositionProvider')
const {ClassicRunner} = require('./runner/ClassicRunner')
const {DomCapture} = require('./DomCapture')
const EyesUtils = require('./EyesUtils')
const EyesCore = require('./EyesCore')

/**
 * @typedef {import('./wrappers/EyesWrappedDriver')} EyesWrappedDriver
 * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./wrappers/EyesBrowsingContext')} EyesBrowsingContext
 * @typedef {import('./wrappers/EyesElementFinder')} EyesElementFinder
 * @typedef {import('./wrappers/EyesDriverController')} EyesDriverController
 * @typedef {import('./wrappers/EyesJsExecutor')} EyesJsExecutor
 * @typedef {import('./fluent/DriverCheckSettings')} DriverCheckSettings
 */

const UNKNOWN_DEVICE_PIXEL_RATIO = 0
const DEFAULT_DEVICE_PIXEL_RATIO = 1

class EyesClassic extends EyesCore {
  /**
   * Create a specialized version of this class
   * @param {Object} implementations - implementations of related classes
   * @param {EyesWrappedDriver} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
   * @param {EyesWrappedElement} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
   * @param {DriverCheckSettings} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
   * @return {EyesClassic} specialized version of this class
   */
  static specialize({agentId, WrappedDriver, WrappedElement, CheckSettings}) {
    return class extends EyesClassic {
      /**
       * @return {EyesWrappedDriver} implementation for {@link EyesWrappedDriver}
       */
      static get WrappedDriver() {
        return WrappedDriver
      }
      /**
       * @return {EyesWrappedElement} implementation for {@link EyesWrappedElement}
       */
      static get WrappedElement() {
        return WrappedElement
      }
      /**
       * @return {DriverCheckSettings} specialized version of {@link DriverCheckSettings}
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
   * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
   * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
   * @param {ClassicRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
   */
  constructor(serverUrl, isDisabled = false, runner = new ClassicRunner()) {
    super(serverUrl, isDisabled)
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)

    /** @type {EyesWrappedDriver} */
    this._driver = undefined
    /** @type {EyesJsExecutor} */
    this._executor = undefined
    /** @type {EyesElementFinder} */
    this._finder = undefined
    /** @type {EyesBrowsingContext} */
    this._context = undefined
    /** @type {EyesDriverController} */
    this._controller = undefined
    /** @type {boolean} */
    this._dontGetTitle = false

    this._imageRotationDegrees = 0
    this._automaticRotation = true
    /** @type {boolean} */
    this._isLandscape = false
    /** @type {boolean} */
    this._checkFullFrameOrElement = false

    /** @type {String} */
    this._originalDefaultContentOverflow = false
    /** @type {String} */
    this._originalFrameOverflow = false

    /** @type {String} */
    this._originalOverflow = null
    this._rotation = undefined
    /** @type {ImageProvider} */
    this._imageProvider = undefined
    /** @type {RegionPositionCompensation} */
    this._regionPositionCompensation = undefined
    /** @type {number} */
    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO
    /** @type {Region} */
    this._regionToCheck = null
    /** @type {PositionProvider} */
    this._targetPositionProvider = undefined
    /** @type {Region} */
    this._effectiveViewport = Region.EMPTY
    /** @type {string}*/
    this._domUrl
    /** @type {EyesScreenshotFactory} */
    this._screenshotFactory = undefined
    /** @type {EyesWrappedElement} */
    this._scrollRootElement = null
    /** @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }
  /**
   * @param {Object} driver - driver object for the specific framework
   * @param {String} [appName] - application name
   * @param {String} [testName] - test name
   * @param {RectangleSize|{width: number, height: number}} [viewportSize] - viewport size
   * @param {SessionType} [sessionType] - type of test (e.g.,  standard test / visual performance test).
   * @returns {Promise<EyesWrappedDriver>}
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

    this._devicePixelRatio = UNKNOWN_DEVICE_PIXEL_RATIO

    if (await this._controller.isMobile()) {
      // set viewportSize to null if browser is mobile
      this._configuration.setViewportSize(null)
    }
    const userAgentString = await this._controller.getUserAgent()
    if (userAgentString) {
      this._userAgent = UserAgent.parseUserAgentString(userAgentString, true)
    }

    this._screenshotFactory = new EyesScreenshotFactory(this._logger, this)
    this._imageProvider = ImageProviderFactory.getImageProvider(
      this._logger,
      this._driver,
      this._rotation,
      this,
      this._userAgent,
      this._rotation,
    )
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
   * @param {string|DriverCheckSettings} [nameOrCheckSettings] - name of the test case
   * @param {DriverCheckSettings} [checkSettings] - check settings for the described test case
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
   * @param {AsyncFunction} operation - check operation
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
   * @param {EyesWrappedElement} targetElement - element to check
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
   * @param {EyesWrappedElement} targetElement - element to check
   * @return {Promise<MatchResult>}
   */
  async _checkFullElement(checkSettings, targetElement) {
    this._shouldCheckFullRegion = true

    if (this._configuration.getHideScrollbars()) {
      await targetElement.hideScrollbars()
    }

    this._regionToCheck = await targetElement.getClientRect()
    this._logger.verbose('Element region: ' + this._regionToCheck)

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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
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
   * @param {DriverCheckSettings} checkSettings - check settings for the described test case
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

    this._logger.verbose('Element region: ' + this._regionToCheck)

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
   * @param {EyesWrappedElement} scrollRootElement - scroll root element
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
      // TODO replace with js snippet
      const [
        location,
        [borderLeftWidth, borderTopWidth],
        [clientWidth, clientHeight],
      ] = await Promise.all([
        scrollRootElement.getLocation(),
        scrollRootElement.getCssProperty('border-left-width', 'border-top-width'),
        scrollRootElement.getProperty('clientWidth', 'clientHeight'),
      ])
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

    this._logger.verbose('Trying to extract device pixel ratio...')
    this._devicePixelRatio = await EyesUtils.getDevicePixelRatio(this._logger, this._driver)
      .catch(async err => {
        const isNative = await this._controller.isNative()
        if (!isNative) throw err
        const viewportSize = await this.getViewportSize()
        return EyesUtils.getMobilePixelRatio(this._logger, this._driver, viewportSize)
      })
      .catch(err => {
        this._logger.verbose('Failed to extract device pixel ratio! Using default.', err)
        return DEFAULT_DEVICE_PIXEL_RATIO
      })

    this._logger.verbose(`Device pixel ratio: ${this._devicePixelRatio}`)
    this._logger.verbose('Setting scale provider...')
    const factory = await this._getScaleProviderFactory().catch(err => {
      this._logger.verbose('Failed to set ContextBasedScaleProvider.', err)
      this._logger.verbose('Using FixedScaleProvider instead...')
      return new FixedScaleProviderFactory(1 / this._devicePixelRatio, this._scaleProviderHandler)
    })
    this._logger.verbose('Done!')
    return factory
  }
  /**
   * @private
   * @return {Promise<ScaleProviderFactory>}
   */
  async _getScaleProviderFactory() {
    const entireSize = await EyesUtils.getCurrentFrameContentEntireSize(
      this._logger,
      this._executor,
    )
    return new ContextBasedScaleProviderFactory(
      this._logger,
      entireSize,
      this._viewportSizeHandler.get(),
      this._devicePixelRatio,
      false,
      this._scaleProviderHandler,
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
          if (throwEx) throw results
          else return results.getTestResults()
        }
        return results
      })

    return this._closePromise
  }

  async tryCaptureDom() {
    try {
      this._logger.verbose('Getting window DOM...')
      return await DomCapture.getFullWindowDom(this._logger, this._driver)
    } catch (ignored) {
      return ''
    }
  }
  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   *
   * @override
   * @inheritDoc
   */
  async getViewportSize() {
    const viewportSize = this._viewportSizeHandler.get()
    return viewportSize
      ? viewportSize
      : EyesUtils.getTopContextViewportSize(this._logger, this._driver)
  }
  /**
   * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
   *
   * @protected
   * @override
   */
  async setViewportSize(viewportSize) {
    if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
      this._logger.verbose('Ignored (viewport size given explicitly)')
      return Promise.resolve()
    }

    if (!(await this._controller.isMobile())) {
      ArgumentGuard.notNull(viewportSize, 'viewportSize')
      viewportSize = new RectangleSize(viewportSize)
      try {
        await EyesUtils.setViewportSize(this._logger, this._driver, new RectangleSize(viewportSize))
        this._effectiveViewport = new Region(Location.ZERO, viewportSize)
      } catch (e) {
        throw new TestFailedError('Failed to set the viewport size', e)
      }
    }

    this._viewportSizeHandler.set(new RectangleSize(viewportSize))
  }

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
   * @return {boolean}
   */
  async getSendDom() {
    return !(await this._controller.isNative()) && super.getSendDom()
  }

  getImageLocation() {
    if (this._regionToCheck) {
      return this._regionToCheck.getLocation()
    }
    return Location.ZERO
  }

  async getInferredEnvironment() {
    try {
      const userAgent = await this._controller.getUserAgent()
      return userAgent ? 'useragent:' + userAgent : userAgent
    } catch (err) {
      return null
    }
  }

  async getAndSaveRenderingInfo() {
    const renderingInfo = await this._runner.getRenderingInfoWithCache()
    this._serverConnector.setRenderingInfo(renderingInfo)
  }

  async _getAndSaveBatchInfoFromServer(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    return this._runner.getBatchInfoWithCache(batchId)
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
