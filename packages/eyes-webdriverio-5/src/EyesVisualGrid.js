'use strict'

const {makeVisualGridClient, takeDomSnapshot} = require('@applitools/visual-grid-client')

const {
  ArgumentGuard,
  EyesBase,
  TestResultsFormatter,
  CorsIframeHandle,
  CorsIframeHandler,
  TypeUtils,
  RectangleSize,
  Configuration,
  VisualGridRunner,
} = require('@applitools/eyes-sdk-core')

const EyesWebDriver = require('./wrappers/EyesWebDriver')
const EyesWDIOUtils = require('./EyesWDIOUtils')
const WDIOJSExecutor = require('./WDIOJSExecutor')
const WebDriver = require('./wrappers/WebDriver')
const Target = require('./fluent/Target')
const FrameChain = require('./frames/FrameChain')

const VERSION = require('../package.json').version

class EyesVisualGrid extends EyesBase {
  /** @var {Logger} EyesVisualGrid#_logger */
  /** @var {Configuration} EyesVisualGrid#_configuration */

  /** @var {ImageMatchSettings} EyesVisualGrid#_defaultMatchSettings */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set to true to disable Applitools Eyes and use the webdriver directly.
   * @param {EyesRunner} [runner] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   */
  constructor(serverUrl, isDisabled, runner = new VisualGridRunner()) {
    super(serverUrl, isDisabled)
    this._runner = runner
    this._runner.attachEyes(this, this._serverConnector)
    this._runner.makeGetVisualGridClient(makeVisualGridClient)

    /** @type {boolean} */ this._isOpen = false
    /** @type {boolean} */ this._isVisualGrid = true
    /** @type {EyesJsExecutor} */ this._jsExecutor = undefined
    /** @type {CorsIframeHandle} */ this._corsIframeHandle = CorsIframeHandle.BLANK

    /** @function */ this._checkWindowCommand = undefined
    /** @function */ this._closeCommand = undefined
    /** @function */ this._abortCommand = undefined
    /** @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }

  /**
   * @signature `open(driver, appName, testName, viewportSize)`
   * @sigparam {object} driver
   * @sigparam {string} [appName]
   * @sigparam {string} [testName]
   * @sigparam {RectangleSize|RectangleSizeObject} [viewportSize]
   *
   * @param {object} driver - The web driver that controls the browser hosting the application under test.
   * @param {Configuration|string} optArg1 - The Configuration for the test or the name of the application under the test.
   * @param {string} [optArg2] - The test name.
   * @param {RectangleSize|RectangleSizeObject} [optArg3] - The required browser's viewport size
   *   (i.e., the visible part of the document's body) or to use the current window's viewport.
   * @param {Configuration} [optArg4] - The Configuration for the test
   * @return {Promise<EyesWebDriver>} - A wrapped WebDriver which enables Eyes trigger recording and frame handling.
   */
  async open(driver, optArg1, optArg2, optArg3, optArg4) {
    ArgumentGuard.notNull(driver, 'driver')

    await this._initDriver(driver)

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

    if (!this._configuration.getViewportSize() && this._configuration.getBrowsersInfo()) {
      for (const browserInfo of this._configuration.getBrowsersInfo()) {
        if (browserInfo.width) {
          this._configuration.setViewportSize(
            new RectangleSize(browserInfo.width, browserInfo.height),
          )
          break
        }
      }
    }
    if (!this._configuration.getViewportSize()) {
      const vs = await this._driver.getDefaultContentViewportSize()
      this._configuration.setViewportSize(vs)
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

    return this._driver
  }

  /**
   * @private
   * @param {object} driver
   */
  async _initDriver(driver) {
    if (driver instanceof EyesWebDriver) {
      this._driver = driver
    } else {
      this._driver = new EyesWebDriver(this._logger, new WebDriver(driver), this)
    }
    this._jsExecutor = new WDIOJSExecutor(this._driver)
  }

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
          if (throwEx) throw error
          else return error.getTestResults()
        }
        return TypeUtils.isArray(results) ? results[0] : results
      })

    return this._closePromise
  }

  /**
   * @return {Promise<?TestResults>}
   */
  async abort() {
    this._isOpen = false
    return this._abortCommand()
  }

  /**
   * @return {boolean}
   */
  getIsOpen() {
    return this._isOpen
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<void>}
   */
  async closeAndPrintResults(throwEx = false) {
    const results = await this.close(throwEx)

    const testResultsFormatter = new TestResultsFormatter(results)
    // eslint-disable-next-line no-console
    console.log(testResultsFormatter.asFormatterString())
  }

  getRunner() {
    return this._runner
  }

  /**
   * @return {boolean}
   */
  isEyesClosed() {
    return this._isOpen
  }

  /**
   * @param {string} name
   * @param {WebdriverioCheckSettings} checkSettings
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings')

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name)
    }

    this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`)

    const pageDomResults = await takeDomSnapshot({
      executeScript: this._jsExecutor.executeScript.bind(this._jsExecutor),
    })
    const {cdt, url, resourceContents, resourceUrls, frames} = pageDomResults

    if (this.getCorsIframeHandle() === CorsIframeHandle.BLANK) {
      CorsIframeHandler.blankCorsIframeSrcOfCdt(cdt, frames)
    }

    this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`)
    const source = await this._driver.getCurrentUrl()

    const [config, {region, selector}] = await Promise.all([
      checkSettings.toCheckWindowConfiguration(this._driver),
      this._getTargetConfiguration(checkSettings),
    ])
    const overrideConfig = {
      fully: this.getForceFullPageScreenshot() || config.fully,
      sendDom: this.getSendDom() || config.sendDom,
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
      source,
    })
  }

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
   * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
   *
   * @param {Integer|String|By|WebElement|EyesWebElement} element - The element which is the frame to switch to. (as
   * would be used in a call to driver.switchTo().frame() ).
   * @param {int|null} matchTimeout - The amount of time to retry matching (milliseconds).
   * @param {String} tag - An optional tag to be associated with the match.
   * @return {Promise} -  promise which is resolved when the validation is finished.
   */
  checkFrame(element, matchTimeout, tag) {
    return this.check(
      tag,
      Target.frame(element)
        .timeout(matchTimeout)
        .fully(),
    )
  }

  /**
   * Visually validates a region in the screenshot.
   *
   * @param {Region} region - The region to validate (in screenshot coordinates).
   * @param {string} [tag] - An optional tag to be associated with the screenshot.
   * @param {number} [matchTimeout] - The amount of time to retry matching.
   * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
   */
  async checkRegion(region, tag, matchTimeout) {
    await this.check(tag, Target.region(region).timeout(matchTimeout))
  }

  /**
   * Takes a snapshot of the application under test and matches it with the expected output.
   *
   * @param {String} tag - An optional tag to be associated with the snapshot.
   * @param {int} matchTimeout - The amount of time to retry matching (Milliseconds).
   * @return {Promise} - A promise which is resolved when the validation is finished.
   */
  checkWindow(tag, matchTimeout) {
    return this.check(tag, Target.window().timeout(matchTimeout))
  }

  /**
   * @return {Promise<RectangleSize>}
   */
  async getViewportSize() {
    return this._configuration.getViewportSize()
  }

  /**
   * @param {RectangleSize|object} viewportSize
   */
  async setViewportSize(viewportSize) {
    ArgumentGuard.notNull(viewportSize, 'viewportSize')
    viewportSize = new RectangleSize(viewportSize)
    this._configuration.setViewportSize(viewportSize)

    if (this._driver) {
      const originalFrame = this._driver.getFrameChain()
      await this._driver.switchTo().defaultContent()

      await EyesWDIOUtils.setViewportSize(this._logger, this._driver, viewportSize)

      /*
            try {
              await EyesWDIOUtils.setViewportSize(this._logger, this._driver, viewportSize);
            } catch (err) {
              await this._driver.switchTo().frames(originalFrame); // Just in case the user catches that error
              throw new TestFailedError('Failed to set the viewport size', err);
            }
      */

      await this._driver.switchTo().frames(originalFrame)
    }
  }

  /**
   * @param {TBDTYPE} action
   * @param {TBDTYPE} control
   * @param {TBDTYPE} cursor
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
      !FrameChain.isSameFrameChain(
        this._driver.getFrameChain(),
        this._lastScreenshot.getFrameChain(),
      )
    ) {
      this._logger.verbose(`Ignoring ${action} (different frame)`)
      return
    }

    EyesBase.prototype.addMouseTriggerBase.call(this, action, control, cursor)
  }

  /**
   * @private
   * @return {boolean}
   */
  isVisualGrid() {
    return this._isVisualGrid
  }

  /**
   * @private
   * @param {CorsIframeHandle} corsIframeHandle
   */
  setCorsIframeHandle(corsIframeHandle) {
    this._corsIframeHandle = corsIframeHandle
  }

  /**
   * @private
   * @return {CorsIframeHandle}
   */
  getCorsIframeHandle() {
    return this._corsIframeHandle
  }

  /**
   * @inheritDoc
   * @return {String}
   */
  getBaseAgentId() {
    return `eyes.webdriverio.visualgrid/${VERSION}`
  }

  /**
   * @private
   * @inheritDoc
   */
  async getInferredEnvironment() {
    return undefined
  }

  /**
   * @private
   * @inheritDoc
   */
  async getScreenshot() {
    return undefined
  }

  /**
   * @private
   * @inheritDoc
   */
  async getTitle() {
    return undefined
  }

  /**
   * @private
   * Get jsExecutor
   * @return {EyesJsExecutor}
   */
  get jsExecutor() {
    return this._jsExecutor
  }

  /**
   * @param {String} apiKey
   */
  setApiKey(apiKey) {
    this._configuration.setApiKey(apiKey)
  }
  /**
   * @return {String}
   */
  getApiKey() {
    return this._configuration.getApiKey()
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

  /*
   * @private
   */
  async _getAndSaveBatchInfoFromServer(batchId) {
    ArgumentGuard.notNullOrEmpty(batchId, 'batchId')
    return this._runner.getBatchInfoWithCache(batchId)
  }
}

exports.EyesVisualGrid = EyesVisualGrid
