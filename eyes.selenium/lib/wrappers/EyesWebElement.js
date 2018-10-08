'use strict';

const { WebElement } = require('selenium-webdriver');
const { Region, MouseTrigger, ArgumentGuard, CoordinatesType } = require('@applitools/eyes.sdk.core');

const JS_GET_SCROLL_LEFT = 'return arguments[0].scrollLeft;';

const JS_GET_SCROLL_TOP = 'return arguments[0].scrollTop;';

const JS_GET_SCROLL_WIDTH = 'return arguments[0].scrollWidth;';

const JS_GET_SCROLL_HEIGHT = 'return arguments[0].scrollHeight;';

const JS_GET_OVERFLOW = 'return arguments[0].style.overflow;';

const JS_GET_CLIENT_WIDTH = 'return arguments[0].clientWidth;';
const JS_GET_CLIENT_HEIGHT = 'return arguments[0].clientHeight;';

/**
 * @param {string} styleProp
 * @return {string}
 */
const JS_GET_COMPUTED_STYLE_FORMATTED_STR = styleProp =>
  `var elem = arguments[0], styleProp = '${styleProp}'; ` + // eslint-disable-line implicit-arrow-linebreak
  'if (window.getComputedStyle) { ' +
  '   return window.getComputedStyle(elem, null).getPropertyValue(styleProp);' +
  '} else if (elem.currentStyle) { ' +
  '   return elem.currentStyle[styleProp];' +
  '} else { ' +
  '   return null;' +
  '}';

/**
 * @param {number} scrollLeft
 * @param {number} scrollTop
 * @return {string}
 */
const JS_SCROLL_TO_FORMATTED_STR = (scrollLeft, scrollTop) =>
  `arguments[0].scrollLeft = ${scrollLeft}; ` + // eslint-disable-line implicit-arrow-linebreak
  `arguments[0].scrollTop = ${scrollTop};`;

/**
 * @param {string} overflow
 * @return {string}
 */
const JS_SET_OVERFLOW_FORMATTED_STR = overflow => `arguments[0].style.overflow = '${overflow}'`;

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
    // noinspection JSCheckFunctionSignatures
    super(eyesDriver.getRemoteWebDriver(), 'unused');

    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(eyesDriver, 'eyesDriver');
    ArgumentGuard.notNull(webElement, 'webElement');

    this._logger = logger;
    this._eyesDriver = eyesDriver;
    this._webElement = webElement;
  }

  /**
   * @return {Promise<Region>}
   */
  async getBounds() {
    const rect = await this.getRect();
    let { x: left, y: top, width, height } = rect.width;

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
   * @param {string} propStyle The style property which value we would like to extract.
   * @return {Promise<string>} The value of the style property of the element, or {@code null}.
   */
  getComputedStyle(propStyle) {
    return this.executeScript(JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle));
  }

  /**
   * @param {string} propStyle The style property which value we would like to extract.
   * @return {Promise<number>} The integer value of a computed style.
   */
  async getComputedStyleInteger(propStyle) {
    const result = await this.getComputedStyle(propStyle);
    return Math.round(parseFloat(result.trim().replace('px', '')));
  }

  /**
   * @return {Promise<number>} The value of the scrollLeft property of the element.
   */
  async getScrollLeft() {
    const result = await this.executeScript(JS_GET_SCROLL_LEFT);
    return Math.ceil(parseFloat(result));
  }

  /**
   * @return {Promise<number>} The value of the scrollTop property of the element.
   */
  async getScrollTop() {
    const result = await this.executeScript(JS_GET_SCROLL_TOP);
    return Math.ceil(parseFloat(result));
  }

  /**
   * @return {Promise<number>} The value of the scrollWidth property of the element.
   */
  async getScrollWidth() {
    const result = await this.executeScript(JS_GET_SCROLL_WIDTH);
    return Math.ceil(parseFloat(result));
  }

  /**
   * @return {Promise<number>} The value of the scrollHeight property of the element.
   */
  async getScrollHeight() {
    const result = await this.executeScript(JS_GET_SCROLL_HEIGHT);
    return Math.ceil(parseFloat(result));
  }

  /**
   * @return {Promise<number>}
   */
  async getClientWidth() {
    const result = await this.executeScript(JS_GET_CLIENT_WIDTH);
    return Math.ceil(parseFloat(result));
  }

  /**
   * @return {Promise<number>}
   */
  async getClientHeight() {
    const result = await this.executeScript(JS_GET_CLIENT_HEIGHT);
    return Math.ceil(parseFloat(result));
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} The width of the left border.
   */
  getBorderLeftWidth() {
    return this.getComputedStyleInteger('border-left-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} The width of the right border.
   */
  getBorderRightWidth() {
    return this.getComputedStyleInteger('border-right-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} The width of the top border.
   */
  getBorderTopWidth() {
    return this.getComputedStyleInteger('border-top-width');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Promise<number>} The width of the bottom border.
   */
  getBorderBottomWidth() {
    return this.getComputedStyleInteger('border-bottom-width');
  }

  /**
   * Scrolls to the specified location inside the element.
   *
   * @param {Location} location The location to scroll to.
   * @return {Promise<void>}
   */
  scrollTo(location) {
    return this.executeScript(JS_SCROLL_TO_FORMATTED_STR(location.getX(), location.getY()));
  }

  /**
   * @return {Promise<string>} The overflow of the element.
   */
  getOverflow() {
    return this.executeScript(JS_GET_OVERFLOW);
  }

  /**
   * @param {string} overflow The overflow to set
   * @return {Promise<void>} The overflow of the element.
   */
  setOverflow(overflow) {
    return this.executeScript(JS_SET_OVERFLOW_FORMATTED_STR(overflow));
  }

  /**
   * @param {string} script The script to execute with the element as last parameter
   * @return {Promise<*>} The result returned from the script
   */
  executeScript(script) {
    // noinspection JSValidateTypes
    return this._eyesDriver.executeScript(script, this.getWebElement());
  }

  /** @inheritDoc */
  getDriver() {
    return this.getWebElement().getDriver();
  }

  /** @inheritDoc */
  getId() {
    return this.getWebElement().getId();
  }

  // noinspection JSCheckFunctionSignatures
  /** @inheritDoc */
  async findElement(locator) {
    const element = await this.getWebElement().findElement(locator);
    return new EyesWebElement(this._logger, this._eyesDriver, element);
  }

  /** @inheritDoc */
  async findElements(locator) {
    const elements = await this.getWebElement().findElements(locator);
    return elements.map(element => new EyesWebElement(this._logger, this._eyesDriver, element));
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @return {Promise<void>}
   */
  async click() {
    // Letting the driver know about the current action.
    const currentControl = await this.getBounds();
    this._eyesDriver.getEyes().addMouseTrigger(MouseTrigger.MouseAction.Click, this);
    this._logger.verbose(`click(${currentControl})`);
    return this.getWebElement().click();
  }

  // noinspection JSCheckFunctionSignatures
  /** @inheritDoc */
  async sendKeys(...keysToSend) {
    for (const keys of keysToSend) {
      await this._eyesDriver.getEyes().addTextTriggerForElement(this, String(keys));
    }

    await this.getWebElement().sendKeys(...keysToSend);
  }

  /** @inheritDoc */
  getTagName() {
    return this.getWebElement().getTagName();
  }

  /** @inheritDoc */
  getCssValue(cssStyleProperty) {
    return this.getWebElement().getCssValue(cssStyleProperty);
  }

  /** @inheritDoc */
  getAttribute(attributeName) {
    return this.getWebElement().getAttribute(attributeName);
  }

  /** @inheritDoc */
  getText() {
    return this.getWebElement().getText();
  }

  /** @inheritDoc */
  async getRect() {
    // The workaround is similar to Java one, but in js we always get raw data with decimal value which we should round up.
    const rect = await this.getWebElement().getRect();
    const width = Math.ceil(rect.width) || 0;
    // noinspection JSSuspiciousNameCombination
    const height = Math.ceil(rect.height) || 0;
    const x = Math.ceil(rect.x) || 0;
    // noinspection JSSuspiciousNameCombination
    const y = Math.ceil(rect.y) || 0;
    return { width, height, x, y };
  }

  /** @inheritDoc */
  isEnabled() {
    return this.getWebElement().isEnabled();
  }

  /** @inheritDoc */
  isSelected() {
    return this.getWebElement().isSelected();
  }

  /** @inheritDoc */
  submit() {
    return this.getWebElement().submit();
  }

  /** @inheritDoc */
  clear() {
    return this.getWebElement().clear();
  }

  /** @inheritDoc */
  isDisplayed() {
    return this.getWebElement().isDisplayed();
  }

  /** @inheritDoc */
  takeScreenshot(optScroll) {
    return this.getWebElement().takeScreenshot(optScroll);
  }

  /**
   * @return {WebElement} The original element object
   */
  getWebElement() {
    // noinspection JSUnresolvedVariable
    if (this._webElement.getWebElement) {
      // noinspection JSUnresolvedFunction
      return this._webElement.getWebElement();
    }

    return this._webElement;
  }
}

exports.EyesWebElement = EyesWebElement;
