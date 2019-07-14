'use strict';

const { By, WebElement } = require('selenium-webdriver');
const { Region, ArgumentGuard, CoordinatesType, TypeUtils, RectangleSize, Location, EyesError, GeneralUtils } = require('@applitools/eyes-common');
const { MouseTrigger } = require('@applitools/eyes-sdk-core');

const JS_GET_SCROLL_SIZE = 'return [arguments[0].scrollWidth, arguments[0].scrollHeight];';

const JS_GET_CLIENT_SIZE = 'return [arguments[0].clientWidth, arguments[0].clientHeight];';

const JS_GET_COMPUTED_STYLE_FN = 'function getCmpStyle(el, p) { return window.getComputedStyle ? window.getComputedStyle(el, null).getPropertyValue(p) : (el.currentStyle ? el.currentStyle[p] : null); };';

/**
 * @param {string} styleProp
 * @return {string}
 */
const JS_GET_COMPUTED_STYLE_FORMATTED_STR = styleProp => `${JS_GET_COMPUTED_STYLE_FN
}return getCmpStyle(arguments[0], '${styleProp}');`;

const JS_GET_SCROLL_LOCATION = 'return [arguments[0].scrollLeft, arguments[0].scrollTop];';

const JS_GET_OVERFLOW = 'return arguments[0].style.overflow;';

const JS_GET_BORDER_WIDTHS_ARR =
  'var retVal = retVal || [];' +
  'if (window.getComputedStyle) { ' +
  'var computedStyle = window.getComputedStyle(elem, null);' +
  'retVal.push(computedStyle.getPropertyValue("border-left-width"));' +
  'retVal.push(computedStyle.getPropertyValue("border-top-width"));' +
  'retVal.push(computedStyle.getPropertyValue("border-right-width")); ' +
  'retVal.push(computedStyle.getPropertyValue("border-bottom-width"));' +
  '} else if (elem.currentStyle) { ' +
  'retVal.push(elem.currentStyle["border-left-width"]);' +
  'retVal.push(elem.currentStyle["border-top-width"]);' +
  'retVal.push(elem.currentStyle["border-right-width"]);' +
  'retVal.push(elem.currentStyle["border-bottom-width"]);' +
  '} else { ' +
  'retVal.push(0,0,0,0);' +
  '}';

const JS_GET_SIZE_AND_BORDER_WIDTHS =
  `${'var elem = arguments[0]; ' +
  'var retVal = [elem.clientWidth, elem.clientHeight]; '}${
    JS_GET_BORDER_WIDTHS_ARR
  }return retVal;`;

/**
 * Wraps a Selenium Web Element.
 */
class EyesWebElement extends WebElement {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} eyesDriver
   * @param {WebElement} webElement
   *
   */
  constructor(logger, eyesDriver, webElement) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(eyesDriver, 'eyesDriver');
    ArgumentGuard.notNull(webElement, 'webElement');

    if (webElement instanceof EyesWebElement) {
      return webElement;
    }

    super(eyesDriver.getRemoteWebDriver(), webElement.getId());

    this._logger = logger;
    this._eyesDriver = eyesDriver;

    /** @type {PositionProvider} */
    this._positionProvider = undefined;
  }

  /**
   * @param {object} object
   * @return {boolean}
   */
  static isLocator(object) {
    return (object instanceof By) || TypeUtils.has(object, ['using', 'value']);
  }

  /**
   * Compares two WebElements for equality.
   *
   * @param {!EyesWebElement|WebElement} a A WebElement.
   * @param {!EyesWebElement|WebElement} b A WebElement.
   * @return {!Promise<boolean>} - A promise that will be resolved to whether the two WebElements are equal.
   */
  static async equals(a, b) {
    if (a instanceof WebElement && b instanceof WebElement) {
      // noinspection JSValidateTypes
      return await a.getId() === await b.getId();
    }

    return false;
  }

  /**
   * @override
   */
  toString() {
    return GeneralUtils.toString(this, ['_logger', '_eyesDriver', '_positionProvider']);
  }

  /**
   * @return {Promise<Region>}
   */
  async getBounds() {
    const rect = await this.getRect();
    let { x: left, y: top, width, height } = rect;

    if (left < 0) {
      width = Math.max(0, width + left);
      left = 0;
    }

    if (top < 0) {
      height = Math.max(0, height + top);
      top = 0;
    }

    return new Region(left, top, width, height, CoordinatesType.CONTEXT_RELATIVE);
  }

  /**
   * Returns the computed value of the style property for the current element.
   *
   * @param {string} propStyle - The style property which value we would like to extract.
   * @return {Promise<string>} - The value of the style property of the element, or {@code null}.
   */
  getComputedStyle(propStyle) {
    return this.executeScript(JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle));
  }

  /**
   * @param {string} propStyle - The style property which value we would like to extract.
   * @return {Promise<number>} - The integer value of a computed style.
   */
  async getComputedStyleInteger(propStyle) {
    const result = await this.getComputedStyle(propStyle);
    return Math.round(parseFloat(result.trim().replace('px', '')));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getScrollLocation} instead
   * @return {Promise<number>} - The value of the scrollLeft property of the element.
   */
  async getScrollLeft() {
    const result = await this.executeScript(JS_GET_SCROLL_LOCATION);
    return Math.ceil(result[0]) || 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getScrollLocation} instead
   * @return {Promise<number>} - The value of the scrollTop property of the element.
   */
  async getScrollTop() {
    const result = await this.executeScript(JS_GET_SCROLL_LOCATION);
    return Math.ceil(result[1]) || 0;
  }

  /**
   * @return {Promise<Location>} - The value of the `scrollLeft` and `scrollTop` property of the element.
   */
  async getScrollLocation() {
    const result = await this.executeScript(JS_GET_SCROLL_LOCATION);
    return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getScrollSize} instead
   * @return {Promise<number>} - The value of the scrollWidth property of the element.
   */
  async getScrollWidth() {
    const result = await this.executeScript(JS_GET_SCROLL_SIZE);
    return Math.ceil(result[0]) || 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getScrollSize} instead
   * @return {Promise<number>} - The value of the scrollHeight property of the element.
   */
  async getScrollHeight() {
    const result = await this.executeScript(JS_GET_SCROLL_SIZE);
    return Math.ceil(result[1]) || 0;
  }

  /**
   * @return {Promise<RectangleSize>} - The value of the `scrollWidth` and `scrollHeight` property of the element.
   */
  async getScrollSize() {
    const result = await this.executeScript(JS_GET_SCROLL_SIZE);
    return new RectangleSize(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getClientSize} instead
   * @return {Promise<number>}
   */
  async getClientWidth() {
    const result = await this.executeScript(JS_GET_CLIENT_SIZE);
    return Math.ceil(result[0]) || 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated use {@link getClientSize} instead
   * @return {Promise<number>}
   */
  async getClientHeight() {
    const result = await this.executeScript(JS_GET_CLIENT_SIZE);
    return Math.ceil(result[1]) || 0;
  }

  /**
   * @return {Promise<RectangleSize>} - The value of the `clientWidth` and `clientHeight` property of the element.
   */
  async getClientSize() {
    const result = await this.executeScript(JS_GET_CLIENT_SIZE);
    return new RectangleSize(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} - The width of the left border.
   */
  getBorderLeftWidth() {
    return this.getComputedStyleInteger('border-left-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} - The width of the right border.
   */
  getBorderRightWidth() {
    return this.getComputedStyleInteger('border-right-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} - The width of the top border.
   */
  getBorderTopWidth() {
    return this.getComputedStyleInteger('border-top-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} - The width of the bottom border.
   */
  getBorderBottomWidth() {
    return this.getComputedStyleInteger('border-bottom-width');
  }

  /**
   * @return {Promise<{top: number, left: number, bottom: number, width: number, right: number, height: number}>}
   */
  async getSizeAndBorders() {
    const result = await this.executeScript(JS_GET_SIZE_AND_BORDER_WIDTHS);
    return {
      width: Math.ceil(result[0]),
      height: Math.ceil(result[1]),
      left: Math.ceil(result[2].replace('px', '')),
      top: Math.ceil(result[2].replace('px', '')),
      right: Math.ceil(result[3].replace('px', '')),
      bottom: Math.ceil(result[5].replace('px', '')),
    };
  }

  /**
   * Scrolls to the specified location inside the element.
   *
   * @param {Location} location - The location to scroll to.
   * @return {Promise<Location>} - the current location after scroll.
   */
  scrollTo(location) {
    try {
      const script = `arguments[0].scrollLeft = ${location.getX()}; arguments[0].scrollTop = ${location.getY()};` +
        'return [arguments[0].scrollLeft, arguments[0].scrollTop];';

      const position = this.executeScript(script);
      return new Location(Math.ceil(position[0]) || 0, Math.ceil(position[1]) || 0);
    } catch (err) {
      throw EyesError('Could not get scroll position!', err);
    }
  }

  /**
   * @return {Promise<string>} - The overflow of the element.
   */
  getOverflow() {
    return this.executeScript(JS_GET_OVERFLOW);
  }

  /**
   * @param {string} overflow - The overflow to set
   * @return {Promise} - The overflow of the element.
   */
  setOverflow(overflow) {
    return this.executeScript(`arguments[0].style.overflow = '${overflow}'`);
  }

  /**
   * @param {string} script - The script to execute with the element as last parameter
   * @return {Promise<*>} - The result returned from the script
   */
  executeScript(script) {
    // noinspection JSValidateTypes
    return this._eyesDriver.executeScript(script, this);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @return {!EyesWebElement} A WebElement that can be used to issue commands against the located element.
   *   If the element is not found, the element will be invalidated and all scheduled commands aborted.
   */
  async findElement(locator) {
    const element = await super.findElement(locator);
    return new EyesWebElement(this._logger, this._eyesDriver, element);
  }

  /**
   * @inheritDoc
   * @return {!Promise<!Array<!EyesWebElement>>} A promise that will resolve to an array of WebElements.
   */
  async findElements(locator) {
    const elements = await super.findElements(locator);
    return elements.map(element => new EyesWebElement(this._logger, this._eyesDriver, element));
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @return {Promise}
   */
  async click() {
    // Letting the driver know about the current action.
    const currentControl = await this.getBounds();
    this._eyesDriver.getEyes().addMouseTrigger(MouseTrigger.MouseAction.Click, this);
    this._logger.verbose(`click(${currentControl})`);
    return super.click();
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   */
  async sendKeys(...keysToSend) {
    for (const keys of keysToSend) {
      await this._eyesDriver.getEyes().addTextTriggerForElement(this, String(keys));
    }

    await super.sendKeys(...keysToSend);
  }

  /**
   * @inheritDoc
   * @return {Promise<{width: number, x: number, y: number, height: number}>}
   */
  async getRect() {
    // The workaround is similar to Java one, but in js we always get raw data with decimal value which we should round up.
    const rect = await super.getRect();
    const width = Math.ceil(rect.width) || 0;
    // noinspection JSSuspiciousNameCombination
    const height = Math.ceil(rect.height) || 0;
    const x = Math.ceil(rect.x) || 0;
    // noinspection JSSuspiciousNameCombination
    const y = Math.ceil(rect.y) || 0;
    return { width, height, x, y };
  }

  /**
   * @return {PositionProvider}
   */
  getPositionProvider() {
    return this._positionProvider;
  }

  /**
   * @param {PositionProvider} positionProvider
   */
  setPositionProvider(positionProvider) {
    this._positionProvider = positionProvider;
  }
}

exports.EyesWebElement = EyesWebElement;
