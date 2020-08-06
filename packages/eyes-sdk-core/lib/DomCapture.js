'use strict'

const axios = require('axios')
const {URL} = require('url')
const {getCaptureDomAndPollScript, getCaptureDomAndPollForIE} = require('@applitools/dom-capture')
const ArgumentGuard = require('./utils/ArgumentGuard')
const GeneralUtils = require('./utils/GeneralUtils')
const PerformanceUtils = require('./utils/PerformanceUtils')
const EyesError = require('./errors/EyesError')
const Location = require('./geometry/Location')

const DomCaptureReturnType = {
  OBJECT: 'OBJECT',
  STRING: 'STRING',
}

const SCRIPT_RESPONSE_STATUS = {
  WIP: 'WIP',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
}

const DOM_EXTRACTION_TIMEOUT = 5 * 60 * 1000
const DOM_CAPTURE_PULL_TIMEOUT = 200 // ms
const DOCUMENT_LOCATION_HREF_SCRIPT = 'return document.location.href'

/**
 * @ignore
 */
class DomCapture {
  /**
   * @param {Logger} logger
   * @param {EyesWrappedDriver} driver
   */
  constructor(logger, driver, script) {
    this._logger = logger
    this._driver = driver
    this._customScript = script
  }

  /**
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWrappedDriver} driver
   * @param {PositionProvider} [positionProvider]
   * @param {DomCaptureReturnType} [returnType]
   * @param {string} [script]
   * @return {Promise<string|object>}
   */
  static async getFullWindowDom(
    logger,
    driver,
    positionProvider,
    returnType = DomCaptureReturnType.STRING,
    script,
  ) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')

    let originalPosition
    if (positionProvider) {
      originalPosition = await positionProvider.getState()
      await positionProvider.setPosition(Location.ZERO)
    }

    const domCapture = new DomCapture(logger, driver, script)
    const dom = await domCapture.getWindowDom()

    if (positionProvider) {
      await positionProvider.restoreState(originalPosition)
    }

    return returnType === DomCaptureReturnType.OBJECT ? JSON.parse(dom) : dom
  }

  async isInternetExplorer() {
    const browserName = this._driver.browserName
    return browserName === 'internet explorer'
  }

  async isEdgeClassic() {
    const browserName = this._driver.browserName
    const browserVersion = this._driver.browserVersion
    if (browserName)
      return browserName.toLowerCase().includes('edge') && Math.floor(browserVersion) <= 44
  }

  async needsIEScript() {
    return (await this.isInternetExplorer()) || (await this.isEdgeClassic())
  }

  /**
   * @return {Promise<string>}
   */
  async getWindowDom() {
    let script
    if (!this._customScript) {
      if (await this.needsIEScript()) {
        const captureDomScript = await getCaptureDomAndPollForIE()
        script = `${captureDomScript} return __captureDomAndPollForIE();`
      } else {
        const captureDomScript = await getCaptureDomAndPollScript()
        script = `${captureDomScript} return __captureDomAndPoll();`
      }
    } else {
      script = this._customScript
    }

    const url = await this._driver.getUrl()
    return this.getFrameDom(script, url)
  }

  /**
   * @param {string} script
   * @param {string} url
   * @return {Promise<string>}
   */
  async getFrameDom(script, url) {
    let timeout, result

    let isCheckTimerTimedOut = false

    try {
      timeout = setTimeout(() => {
        isCheckTimerTimedOut = true
      }, DOM_EXTRACTION_TIMEOUT)

      do {
        this._logger.verbose('executing dom capture')
        const resultAsString = await this._driver.execute(script)
        result = JSON.parse(resultAsString)
        await GeneralUtils.sleep(DOM_CAPTURE_PULL_TIMEOUT)
      } while (result.status === SCRIPT_RESPONSE_STATUS.WIP && !isCheckTimerTimedOut)
    } finally {
      clearTimeout(timeout)
    }

    if (result.status === SCRIPT_RESPONSE_STATUS.ERROR) {
      throw new EyesError(
        `Error during capture dom and pull script: '${result.error}'`,
        result.error,
      )
    }

    if (isCheckTimerTimedOut) {
      throw new EyesError('DomCapture Timed out')
    }

    const domSnapshotRawArr = result && result.value ? result.value.split('\n') : []

    if (domSnapshotRawArr.length === 0) {
      return {}
    }

    const separatorJson = JSON.parse(domSnapshotRawArr[0])
    const cssEndIndex = domSnapshotRawArr.indexOf(separatorJson.separator)
    const iframeEndIndex = domSnapshotRawArr.indexOf(separatorJson.separator, cssEndIndex + 1)
    let domSnapshot = domSnapshotRawArr[iframeEndIndex + 1]

    const cssArr = []
    for (let i = 1; i < cssEndIndex; i += 1) {
      cssArr.push(domSnapshotRawArr[i])
    }

    const cssPromises = []
    for (const cssHref of cssArr) {
      if (cssHref) {
        cssPromises.push(this._downloadCss(url, cssHref))
      }
    }

    const cssResArr = await Promise.all(cssPromises)

    for (const cssRes of cssResArr) {
      domSnapshot = domSnapshot.replace(
        `"${separatorJson.cssStartToken}${cssRes.href}${separatorJson.cssEndToken}"`,
        cssRes.css,
      )
    }

    const iframeArr = []
    for (let i = cssEndIndex + 1; i < iframeEndIndex; i += 1) {
      iframeArr.push(domSnapshotRawArr[i])
    }

    for (const iframeXpath of iframeArr) {
      if (iframeXpath) {
        let domIFrame
        try {
          const originLocation = await this.getLocation()

          const framesCount = await this._switchToFrame(iframeXpath)

          const locationAfterSwitch = await this.getLocation()
          if (locationAfterSwitch === originLocation) {
            this._logger.log('Switching to frame failed')
            domIFrame = {}
          } else {
            domIFrame = await this.getFrameDom(script, url)
            await this._switchToParentFrame(framesCount)
          }
        } catch (ignored) {
          domIFrame = {}
        }
        domSnapshot = domSnapshot.replace(
          `"${separatorJson.iframeStartToken}${iframeXpath}${separatorJson.iframeEndToken}"`,
          domIFrame,
        )
      }
    }

    return domSnapshot
  }

  async getLocation() {
    return this._driver.execute(DOCUMENT_LOCATION_HREF_SCRIPT)
  }

  /**
   * @param {string|string[]} xpaths
   * @return {Promise<number>}
   * @private
   */
  async _switchToFrame(xpaths) {
    if (!Array.isArray(xpaths)) {
      xpaths = xpaths.split(',')
    }

    let framesCount = 0
    for (const xpath of xpaths) {
      const iframeEl = await this._driver.element({type: 'xpath', selector: `/${xpath}`})
      await this._driver.context.frame(iframeEl)
      framesCount += 1
    }

    return framesCount
  }

  /**
   * @private
   * @return {Promise<number>}
   */
  async _switchToParentFrame(switchedToFrameCount) {
    if (switchedToFrameCount > 0) {
      await this._driver.context.frameParent()
      return this._switchToParentFrame(switchedToFrameCount - 1)
    }

    return switchedToFrameCount
  }

  /**
   * @param {string} baseUri
   * @param {string} href
   * @param {number} [retriesCount=1]
   * @return {Promise<{href: string, css: string}>}
   * @private
   */
  async _downloadCss(baseUri, href, retriesCount = 1) {
    try {
      this._logger.verbose(`Given URL to download: ${href}`)
      let absHref = href
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        absHref = new URL(href.toString(), baseUri).href
      }

      const timeStart = PerformanceUtils.start()
      const response = await axios(absHref)
      const css = response.data
      this._logger.verbose(
        `downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`,
      )
      const escapedCss = GeneralUtils.cleanStringForJSON(css)
      return {href: absHref, css: escapedCss}
    } catch (ex) {
      this._logger.verbose(ex.toString())
      retriesCount -= 1
      if (retriesCount > 0) {
        return this._downloadCss(baseUri, href, retriesCount)
      }
      return {href, css: ''}
    }
  }

  getDriver() {
    return this._driver
  }
}

Object.freeze(DomCaptureReturnType)
module.exports = DomCapture
exports.DomCaptureReturnType = DomCaptureReturnType
