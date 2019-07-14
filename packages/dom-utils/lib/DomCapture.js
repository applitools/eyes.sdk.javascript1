'use strict';

const axios = require('axios');
const { URL } = require('url');

const { ArgumentGuard, Location, GeneralUtils, PerformanceUtils } = require('@applitools/eyes-common');
const { getCaptureDomScript } = require('@applitools/dom-capture');

const DomCaptureReturnType = {
  OBJECT: 'OBJECT',
  STRING: 'STRING',
};

/**
 * @ignore
 */
class DomCapture {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver|WebDriver} driver
   */
  constructor(logger, driver) {
    this._logger = logger;
    this._driver = driver;
  }

  /**
   * @param {Logger} logger - A Logger instance.
   * @param {EyesWebDriver|WebDriver} driver
   * @param {PositionProvider} [positionProvider]
   * @param {DomCaptureReturnType} [returnType]
   * @return {Promise<string|object>}
   */
  static async getFullWindowDom(logger, driver, positionProvider, returnType = DomCaptureReturnType.STRING) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(driver, 'driver');

    let originalPosition;
    if (positionProvider) {
      originalPosition = await positionProvider.getState();
      await positionProvider.setPosition(Location.ZERO);
    }

    const domCapture = new DomCapture(logger, driver);
    const dom = await domCapture.getWindowDom();

    if (positionProvider) {
      await positionProvider.restoreState(originalPosition);
    }

    return returnType === DomCaptureReturnType.OBJECT ? JSON.parse(dom) : dom;
  }

  /**
   * @return {Promise<{string}>}
   */
  async getWindowDom() {
    const captureDomScript = await getCaptureDomScript();

    const asyncCaptureDomScript =
      `var callback = arguments[arguments.length - 1];
      (${captureDomScript})().then(res => {
        return callback(res)
      })`;
    const url = await this._driver.getCurrentUrl();

    return this.getFrameDom(asyncCaptureDomScript, url);
  }

  /**
   * @param {string} script
   * @param {string} url
   * @return {Promise<{string}>}
   */
  async getFrameDom(script, url) {
    const domSnapshotRaw = await this._driver.executeAsyncScript(script);

    const domSnapshotRawArr = domSnapshotRaw ? domSnapshotRaw.split('\n') : [];

    if (domSnapshotRawArr.length === 0) {
      return {};
    }

    const separatorJson = JSON.parse(domSnapshotRawArr[0]);
    const cssEndIndex = domSnapshotRawArr.indexOf(separatorJson.separator);
    const iframeEndIndex = domSnapshotRawArr.indexOf(separatorJson.separator, cssEndIndex + 1);
    let domSnapshot = domSnapshotRawArr[iframeEndIndex + 1];

    const cssArr = [];
    for (let i = 1; i < cssEndIndex; i += 1) {
      cssArr.push(domSnapshotRawArr[i]);
    }

    const cssPromises = [];
    for (const cssHref of cssArr) {
      if (cssHref) {
        cssPromises.push(this._downloadCss(url, cssHref));
      }
    }

    const cssResArr = await Promise.all(cssPromises);

    for (const cssRes of cssResArr) {
      domSnapshot = domSnapshot.replace(`"${separatorJson.cssStartToken}${cssRes.href}${separatorJson.cssEndToken}"`, cssRes.css);
    }

    const iframeArr = [];
    for (let i = cssEndIndex + 1; i < iframeEndIndex; i += 1) {
      iframeArr.push(domSnapshotRawArr[i]);
    }

    for (const iframeXpath of iframeArr) {
      if (iframeXpath) {
        const framesCount = await this._switchToFrame(iframeXpath);
        let domIFrame;
        try {
          domIFrame = await this.getFrameDom(script, url);
        } catch (ignored) {
          domIFrame = {};
        }
        await this._switchToParentFrame(framesCount);
        domSnapshot = domSnapshot.replace(`"${separatorJson.iframeStartToken}${iframeXpath}${separatorJson.iframeEndToken}"`, domIFrame);
      }
    }

    return domSnapshot;
  }

  /**
   * @param {string|string[]} xpaths
   * @return {Promise<number>}
   * @private
   */
  async _switchToFrame(xpaths) {
    if (!Array.isArray(xpaths)) {
      xpaths = xpaths.split(',');
    }

    let framesCount = 0;
    for (const xpath of xpaths) {
      const iframeEl = await this._driver.findElementByXPath(`/${xpath}`);
      await this._driver.switchTo().frame(iframeEl);
      framesCount += 1;
    }

    return framesCount;
  }

  /**
   * @private
   * @return {Promise<number>}
   */
  async _switchToParentFrame(switchedToFrameCount) {
    if (switchedToFrameCount > 0) {
      await this._driver.switchTo().parentFrame();
      return this._switchToParentFrame(switchedToFrameCount - 1);
    }

    return switchedToFrameCount;
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
      this._logger.verbose(`Given URL to download: ${href}`);
      let absHref = href;
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        absHref = new URL(href.toString(), baseUri).href;
      }

      const timeStart = PerformanceUtils.start();
      const response = await axios(absHref);
      const css = response.data;
      this._logger.verbose(`downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`);
      return { href: absHref, css };
    } catch (ex) {
      this._logger.verbose(ex.toString());
      retriesCount -= 1;
      if (retriesCount > 0) {
        return this._downloadCss(baseUri, href, retriesCount);
      }
      return { href, css: '' };
    }
  }

  getDriver() {
    return this._driver;
  }
}

Object.freeze(DomCaptureReturnType);
exports.DomCaptureReturnType = DomCaptureReturnType;
exports.DomCapture = DomCapture;
