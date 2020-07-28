'use strict'

const BrowserType = require('./config/BrowserType')
const Configuration = require('./config/Configuration')
const TypeUtils = require('./utils/TypeUtils')
const ArgumentGuard = require('./utils/ArgumentGuard')
const TestResultsFormatter = require('./TestResultsFormatter')
const MatchResult = require('./match/MatchResult')
const CorsIframeHandler = require('./capture/CorsIframeHandler')
const CorsIframeHandles = require('./capture/CorsIframeHandles')
const VisualGridRunner = require('./runner/VisualGridRunner')
const EyesUtils = require('./EyesUtils')
const EyesCore = require('./EyesCore')

/**
 * @typedef {import('./capture/CorsIframeHandles').CorsIframeHandle} CorsIframeHandle
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
  static specialize({agentId, WrappedDriver, WrappedElement, CheckSettings, VisualGridClient}) {
    return class extends EyesVisualGrid {
      static get WrappedDriver() {
        return WrappedDriver
      }
      static get WrappedElement() {
        return WrappedElement
      }
      static get CheckSettings() {
        return CheckSettings
      }
      static get VisualGridClient() {
        return VisualGridClient
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
    /** @private @type {EyesJsExecutor<TDriver, TElement, TSelector>} */
    this._jsExecutor = undefined
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

    this._driver = new this.constructor.WrappedDriver(this._logger, driver)
    this._executor = this._driver.executor
    this._finder = this._driver.finder
    this._context = this._driver.context
    this._controller = this._driver.controller

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
      const vs = await EyesUtils.getTopContextViewportSize(this._logger, this._driver)
      this._configuration.setViewportSize(vs)
    }

    if (!browsersInfo || browsersInfo.length === 0) {
      const vs = this._configuration.getViewportSize()
      this._configuration.addBrowser(vs.getWidth(), vs.getHeight(), BrowserType.CHROME)
    }

    if (this._runner.getConcurrentSessions())
      this._configuration.setConcurrentSessions(this._runner.getConcurrentSessions())

    const {openEyes} = await this._runner.getVisualGridClientWithCache({
      logger: this._logger,
      agentId: this.getFullAgentId(),
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      saveDebugData: this._configuration.getSaveDebugData(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      renderConcurrencyFactor: this._configuration.getConcurrentSessions(),
    })

    if (this._configuration.getViewportSize()) {
      const vs = this._configuration.getViewportSize()
      await this.setViewportSize(vs)
    }

    const {checkWindow, close, abort} = await openEyes(
      this._configuration.toOpenEyesConfiguration(),
    )

    this._isOpen = true
    this._checkWindowCommand = checkWindow
    this._closeCommand = close
    this._abortCommand = abort

    await this._initCommon()

    return this._driver
  }
  /**
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

    await this._context.framesRefresh()
    return this._checkPrepare(checkSettings, async () => {
      // this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`)
      const pageDomResults = await this.constructor.VisualGridClient.takeDomSnapshot({
        executeScript: this._executor.executeScript.bind(this._executor),
      })
      const {cdt, url, resourceContents, resourceUrls, frames} = pageDomResults
      if (this.getCorsIframeHandle() === CorsIframeHandles.BLANK) {
        CorsIframeHandler.blankCorsIframeSrcOfCdt({url, cdt, frames})
      }
      // this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`)

      const [config, {region, selector}] = await Promise.all([
        checkSettings.toCheckWindowConfiguration(this._driver),
        this._getTargetConfiguration(checkSettings),
      ])
      const overrideConfig = {
        fully: this.getForceFullPageScreenshot() || config.fully,
        sendDom: (await this.getSendDom()) || config.sendDom,
        matchLevel: this.getMatchLevel() || config.matchLevel,
      }
      await this._checkWindowCommand({
        ...config,
        ...overrideConfig,
        region,
        selector,
        resourceUrls,
        resourceContents,
        frames,
        url,
        cdt,
      })
    })
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings
   * @param {Function} operation
   */
  async _checkPrepare(checkSettings, operation) {
    const originalFrameChain = this._context.frameChain
    const appendFrameChain = checkSettings.frameChain
    await this._context.framesAppend(appendFrameChain)
    try {
      return await operation()
    } finally {
      await this._context.frames(originalFrameChain)
    }
  }
  /**
   * @private
   * @param {CheckSettings<TElement, TSelector>} checkSettings
   */
  async _getTargetConfiguration(checkSettings) {
    const targetSelector =
      checkSettings.getTargetProvider() &&
      checkSettings
        .getTargetProvider()
        .toPersistedRegions(this._driver)
        .then(r => r[0])
    const targetRegion =
      checkSettings.getTargetRegion() &&
      checkSettings
        .getTargetRegion()
        .toPersistedRegions(this._driver)
        .then(r => r[0])

    const [region, selector] = await Promise.all([targetRegion, targetSelector])
    return {region, selector}
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
          const error = TypeUtils.isArray(results) ? results[0] : results
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
