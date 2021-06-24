'use strict'
const BrowserType = require('../config/BrowserType')
const Configuration = require('../config/Configuration')
const TypeUtils = require('../utils/TypeUtils')
const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const TestResultsFormatter = require('../TestResultsFormatter')
const CorsIframeHandler = require('../capture/CorsIframeHandler')
const CorsIframeHandles = require('../capture/CorsIframeHandles')
const VisualGridRunner = require('../runner/VisualGridRunner')
const takeDomSnapshots = require('../utils/takeDomSnapshots')
const EyesCore = require('./EyesCore')
const EyesUtils = require('./EyesUtils')
const {
  resolveAllRegionElements,
  toCheckWindowConfiguration,
} = require('../fluent/CheckSettingsUtils')

/**
 * @typedef {import('../capture/CorsIframeHandles').CorsIframeHandle} CorsIframeHandle
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
 * @typedef {import('../fluent/DriverCheckSettings')<TElement, TSelector>} CheckSettings
 */

/**
 * @template TDriver
 * @template TElement
 * @template TSelector
 * @extends {EyesCore<TDriver, TElement, TSelector>}
 */
class EyesVisualGrid extends EyesCore {
  /**
   * Create a specialized version of this class
   * @template TDriver, TElement, TSelector
   * @param {Object} implementations - implementations of related classes
   * @param {string} implementations.agentId - base agent id
   * @param {EyesWrappedDriverCtor<TDriver, TElement, TSelector>} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
   * @param {EyesWrappedElementCtor<TDriver, TElement, TSelector> & EyesWrappedElementStatics<TDriver, TElement, TSelector>} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
   * @param {CheckSettings<TElement, TSelector>} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
   * @param {VisualGridClient} implementations.VisualGridClient - visual grid client
   * @return {new (...args: ConstructorParameters<typeof EyesVisualGrid>) => EyesVisualGrid<TDriver, TElement, TSelector>} specialized version of this class
   */
  static specialize({agentId, spec, VisualGridClient}) {
    return class extends EyesVisualGrid {
      static get spec() {
        return spec
      }
      static get VisualGridClient() {
        return VisualGridClient
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
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
   * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {VisualGridRunner} [runner] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   */
  constructor(serverUrl, isDisabled, runner = new VisualGridRunner()) {
    super(serverUrl, isDisabled)
    /** @private */
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)
    this._runner.makeGetVisualGridClient(this.constructor.VisualGridClient.makeVisualGridClient)

    /** @private @type {boolean} */
    this._isOpen = false
    /** @private @type {boolean} */
    this._isVisualGrid = true
    /** @private @type {CorsIframeHandle} */
    this._corsIframeHandle = CorsIframeHandles.BLANK

    /** @private */
    this._checkWindowCommand = undefined
    /** @private */
    this._closeCommand = undefined
    /** @private */
    this._abortCommand = undefined

    /** @private @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }
  /**
   * @template {TDriver} CDriver
   * @param {CDriver} driver The web driver that controls the browser hosting the application under test.
   * @param {Configuration|string} optArg1 The Configuration for the test or the name of the application under the test.
   * @param {string} [optArg2] The test name.
   * @param {RectangleSize|object} [optArg3] The required browser's viewport size
   *   (i.e., the visible part of the document's body) or to use the current window's viewport.
   * @param {Configuration} [optArg4] The Configuration for the test
   * @return {Promise<CDriver & EyesWrappedDriver<TDriver, TElement, TSelector>>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
   */
  async open(driver, optArg1, optArg2, optArg3, optArg4) {
    ArgumentGuard.notNull(driver, 'driver')

    this._driver = await this.spec.newDriver(this._logger, driver).init()
    this._context = this._driver.currentContext

    if (optArg1 instanceof Configuration) {
      this._configuration.mergeConfig(optArg1)
    } else {
      this._configuration.setAppName(
        TypeUtils.getOrDefault(optArg1, this._configuration.getAppName()),
      )
      this._configuration.setTestName(
        TypeUtils.getOrDefault(optArg2, this._configuration.getTestName()),
      )
      this._configuration.setViewportSize(
        TypeUtils.getOrDefault(optArg3, this._configuration.getViewportSize()),
      )
      this._configuration.setSessionType(
        TypeUtils.getOrDefault(optArg4, this._configuration.getSessionType()),
      )
    }

    ArgumentGuard.notNull(this._configuration.getAppName(), 'appName')
    ArgumentGuard.notNull(this._configuration.getTestName(), 'testName')

    const browsersInfo = this._configuration.getBrowsersInfo()
    if (!this._configuration.getViewportSize() && browsersInfo && browsersInfo.length > 0) {
      const browserInfo = browsersInfo.find(browserInfo => browserInfo.width)
      if (browserInfo) {
        this._configuration.setViewportSize({width: browserInfo.width, height: browserInfo.height})
      }
    }

    if (!this._configuration.getViewportSize()) {
      const vs = await this._driver.getViewportSize()
      this._configuration.setViewportSize(vs)
    }

    if (!browsersInfo || browsersInfo.length === 0) {
      const vs = this._configuration.getViewportSize()
      this._configuration.addBrowser(vs.getWidth(), vs.getHeight(), BrowserType.CHROME)
    }

    const {
      openEyes,
      getResourceUrlsInCache,
      getIosDevicesSizes,
      getEmulatedDevicesSizes,
    } = await this._runner.getVisualGridClientWithCache({
      logger: this._logger,
      agentId: this.getFullAgentId(),
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      concurrency: this._runner.legacyConcurrency || this._configuration.getConcurrentSessions(),
      testConcurrency: this._runner.testConcurrency,
    })

    if (this._configuration.getViewportSize()) {
      const vs = this._configuration.getViewportSize()
      await this.setViewportSize(vs)
    }

    const openParams = this._configuration.toOpenEyesConfiguration()
    const {checkWindow, close, abort} = await openEyes({
      ...openParams,
      agentRunId: `${openParams.testName}--${GeneralUtils.randomAlphanumeric(10)}`,
    })

    this._isOpen = true
    this._checkWindowCommand = checkWindow
    this._closeCommand = close
    this._abortCommand = abort
    this._getResourceUrlsInCache = getResourceUrlsInCache
    this._getIosDevicesSizes = getIosDevicesSizes
    this._getEmulatedDevicesSizes = getEmulatedDevicesSizes

    await this._initCommon()

    return this._driver.wrapper
  }
  /**
   * @param {string|CheckSettings<TElement, TSelector>} [nameOrCheckSettings] - name of the test case
   * @param {CheckSettings<TElement, TSelector>} [checkSettings] - check settings for the described test case
   * @returns {Promise<MatchResult>}
   */
  async _check(checkSettings, closeAfterMatch = false, throwEx = true) {
    this._logger.verbose(
      `check started with tag "${checkSettings.getName()}" for test "${this._configuration.getTestName()}"`,
    )

    return this._checkPrepare(checkSettings, async () => {
      const elementsById = await resolveAllRegionElements({
        checkSettings,
        context: this._context,
      })
      await EyesUtils.setElementMarkers(this._logger, this._context, elementsById)

      this._logger.verbose(`elements marked: ${Object.keys(elementsById)}`)

      try {
        const breakpoints = TypeUtils.getOrDefault(
          checkSettings.getLayoutBreakpoints(),
          this._configuration.getLayoutBreakpoints(),
        )
        const disableBrowserFetching = TypeUtils.getOrDefault(
          checkSettings.getDisableBrowserFetching(),
          this._configuration.getDisableBrowserFetching(),
        )
        const browsers = this._configuration.getBrowsersInfo()
        const showLogs = this._configuration.getShowLogs()

        const {snapshots, cookies} = await takeDomSnapshots({
          breakpoints,
          browsers,
          disableBrowserFetching,
          driver: this._driver,
          logger: this._logger,
          skipResources: this._getResourceUrlsInCache(),
          getViewportSize: () =>
            this.getViewportSize().then(rectangleSize => rectangleSize.toJSON()),
          getEmulatedDevicesSizes: this._getEmulatedDevicesSizes,
          getIosDevicesSizes: this._getIosDevicesSizes,
          showLogs,
        })

        const [{url}] = snapshots
        if (this.getCorsIframeHandle() === CorsIframeHandles.BLANK) {
          snapshots.forEach(CorsIframeHandler.blankCorsIframeSrcOfCdt)
        }

        const config = toCheckWindowConfiguration({
          checkSettings,
          configuration: this._configuration,
        })

        return await this._checkWindowCommand({
          ...config,
          closeAfterMatch,
          throwEx,
          snapshot: snapshots,
          url,
          cookies,
        })
      } finally {
        await EyesUtils.cleanupElementMarkers(
          this._logger,
          this._context,
          Object.values(elementsById),
        )
      }
    })
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings
   * @param {Function} operation
   */
  async _checkPrepare(checkSettings, operation) {
    this._context = await this._driver.refreshContexts()
    await this._context.main.setScrollRootElement(this._scrollRootElement)
    await this._context.setScrollRootElement(checkSettings.getScrollRootElement())
    const originalContext = this._context
    if (checkSettings.getContext()) {
      this._context = await this._context.context(checkSettings.getContext())
      await this._context.focus()
    }
    try {
      return await operation()
    } finally {
      this._context = await originalContext.focus()
    }
  }

  /**
   * @inheritDoc
   */
  async getScreenshot() {
    return undefined
  }
  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults>}
   */
  async close(throwEx = true) {
    let isErrorCaught = false
    this._closePromise = this._closeCommand(true)
      .catch(err => {
        isErrorCaught = true
        return err
      })
      .then(results => {
        this._isOpen = false
        if (this._runner) {
          this._runner._allTestResult.push(...results)
        }
        if (isErrorCaught) {
          const error = TypeUtils.isArray(results)
            ? results.find(result => result instanceof Error)
            : results
          if (throwEx || !error.getTestResults) throw error
          else return error.getTestResults()
        }
        return TypeUtils.isArray(results) ? results[0] : results
      })

    return this._closePromise
  }
  /**
   * @param {boolean} [throwEx]
   * @return {Promise<void>}
   */
  async closeAndPrintResults(throwEx = true) {
    const results = await this.close(throwEx)

    const testResultsFormatter = new TestResultsFormatter(results)
    // eslint-disable-next-line no-console
    console.log(testResultsFormatter.asFormatterString())
  }
  /**
   * @return {Promise<TestResults>}
   */
  async abort() {
    this._isOpen = false
    return this._abortCommand()
  }
  /**
   * @inheritDoc
   */
  async getInferredEnvironment() {
    return undefined
  }
}
module.exports = EyesVisualGrid
