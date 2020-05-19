'use strict'

const {makeVisualGridClient, takeDomSnapshot} = require('@applitools/visual-grid-client')
const {
  ArgumentGuard,
  TypeUtils,
  EyesError,
  UserAgent,
  BrowserType,
  CorsIframeHandle,
  CorsIframeHandler,
  VisualGridRunner,
} = require('@applitools/eyes-sdk-core')

const {Eyes} = require('./Eyes')

const VERSION = require('../package.json').version

/**
 * @ignore
 */
class EyesVisualGrid extends Eyes {
  /** @var {Logger} EyesVisualGrid#_logger */
  /** @var {Configuration} EyesVisualGrid#_configuration */

  /**
   * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
   *
   * @param {string} [serverUrl] - The Eyes server URL.
   * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
   * @param {VisualGridRunner} [runner] - Set shared VisualGridRunner if you want to group results.
   */
  constructor(serverUrl, isDisabled, runner = new VisualGridRunner()) {
    super(serverUrl, isDisabled, runner)

    this._isVisualGrid = true

    this._runner.makeGetVisualGridClient(makeVisualGridClient)

    /** @type {UserAgent} */
    this._userAgent = undefined

    /** @function */ this._checkWindowCommand = undefined
    /** @function */ this._closeCommand = undefined
    /** @function */ this._abortCommand = undefined

    /** @type {Promise<void>} */
    this._closePromise = Promise.resolve()
  }

  /**
   * @override
   * @protected
   * @return {string} - The base agent id of the SDK.
   */
  getBaseAgentId() {
    return `eyes.selenium.visualgrid.javascript/${VERSION}`
  }

  /**
   * @inheritDoc
   */
  async open(driver, appName, testName, viewportSize, sessionType) {
    ArgumentGuard.notNull(driver, 'driver')

    if (appName) this._configuration.setAppName(appName)
    if (testName) this._configuration.setTestName(testName)
    if (viewportSize) this._configuration.setViewportSize(viewportSize)
    if (sessionType) this._configuration.setSessionType(sessionType)

    if (this._runner.getConcurrentSessions()) {
      this._configuration.setConcurrentSessions(this._runner.getConcurrentSessions())
    }

    await this._initDriver(driver)

    const uaString = await this._driver.getUserAgent()
    if (uaString) {
      this._userAgent = UserAgent.parseUserAgentString(uaString, true)
    }

    const {openEyes} = await this._runner.getVisualGridClientWithCache({
      logger: this._logger,
      agentId: this.getFullAgentId(),
      apiKey: this._configuration.getApiKey(),
      showLogs: this._configuration.getShowLogs(),
      saveDebugData: this._configuration.getSaveDebugData(),
      proxy: this._configuration.getProxy(),
      serverUrl: this._configuration.getServerUrl(),
      concurrency: this._configuration.getConcurrentSessions(),
    })

    if (this._configuration.getViewportSize()) {
      await this.setViewportSize(this._configuration.getViewportSize())

      const browserInfo = this._configuration.getBrowsersInfo()
      if (!browserInfo || (Array.isArray(browserInfo) && browserInfo.length === 0)) {
        this._configuration.addBrowser(
          this._configuration.getViewportSize().getWidth(),
          this._configuration.getViewportSize().getHeight(),
          BrowserType.CHROME,
        )
      }
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
   * @inheritDoc
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings')

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name)
    }

    try {
      this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})`)

      const pageDomResults = await takeDomSnapshot({
        executeScript: this._driver.executeScript.bind(this._driver),
        browser: this._userAgent.getBrowser(),
      })

      const {cdt, url, resourceContents, resourceUrls, frames} = pageDomResults

      if (this.getCorsIframeHandle() === CorsIframeHandle.BLANK) {
        CorsIframeHandler.blankCorsIframeSrcOfCdt(cdt, frames)
      }
      this._logger.verbose(`Dom extracted  (${checkSettings.toString()})`)

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
      })
    } catch (e) {
      throw new EyesError(`Failed to extract DOM from the page: ${e.toString()}`, e)
    }
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
}

exports.EyesVisualGrid = EyesVisualGrid
