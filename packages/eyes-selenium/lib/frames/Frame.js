'use strict';

const { By } = require('selenium-webdriver');
const { ArgumentGuard } = require('@applitools/eyes-common');
const { ScrollPositionMemento } = require('../positioning/ScrollPositionMemento');
const { ScrollPositionProvider } = require('../positioning/ScrollPositionProvider');

/**
 * Encapsulates a frame/iframe. This is a generic type class, and it's actual type is determined by the reference used
 * by the user in order to switch into the frame.
 */
class Frame {
  /**
   * @param {Logger} logger - A Logger instance.
   * @param {WebElement} reference - The web element for the frame, used as a reference to switch into the frame.
   * @param {Location} location - The location of the frame within the current frame.
   * @param {RectangleSize} outerSize - The frame element size (i.e., the size of the frame on the screen, not the
   *   internal document size).
   * @param {RectangleSize} innerSize - The frame element inner size (i.e., the size of the frame actual size, without
   *   borders).
   * @param {Location} originalLocation - The scroll location of the frame.
   * @param {string} jsExecutor - The Javascript Executor to use. Usually that will be the WebDriver.
   */
  constructor(logger, reference, location, outerSize, innerSize, originalLocation, jsExecutor) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(reference, 'reference');
    ArgumentGuard.notNull(location, 'location');
    ArgumentGuard.notNull(outerSize, 'outerSize');
    ArgumentGuard.notNull(innerSize, 'innerSize');
    ArgumentGuard.notNull(originalLocation, 'originalLocation');
    ArgumentGuard.notNull(jsExecutor, 'jsExecutor');

    logger.verbose(`Frame(logger, reference, ${location}, ${outerSize}, ${innerSize}, ${originalLocation})`);

    this._logger = logger;
    this._reference = reference;
    this._location = location;
    this._outerSize = outerSize;
    this._innerSize = innerSize;
    this._originalLocation = originalLocation;
    this._positionMemento = new ScrollPositionMemento(originalLocation);
    this._jsExecutor = jsExecutor;
  }

  /**
   * @return {WebElement}
   */
  getReference() {
    return this._reference;
  }

  /**
   * @return {Location}
   */
  getLocation() {
    return this._location;
  }

  /**
   * @return {RectangleSize}
   */
  getOuterSize() {
    return this._outerSize;
  }

  /**
   * @return {RectangleSize}
   */
  getInnerSize() {
    return this._innerSize;
  }

  /**
   * @return {Location}
   */
  getOriginalLocation() {
    return this._originalLocation;
  }

  /**
   * @return {WebElement}
   */
  getScrollRootElement() {
    return this._scrollRootElement;
  }

  /**
   * @param {EyesWebDriver} driver
   * @return {Promise<WebElement>}
   */
  async getForceScrollRootElement(driver) {
    if (!this._scrollRootElement) {
      this._logger.verbose('no scroll root element. selecting default.');
      this._scrollRootElement = await driver.findElement(By.css('html'));
    }

    return this._scrollRootElement;
  }

  /**
   * @param {WebElement} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement;
  }

  /**
   * @param {EyesWebDriver} driver
   * @return {Promise}
   */
  async hideScrollbars(driver) {
    const scrollRootElement = await this.getForceScrollRootElement(driver);
    this._logger.verbose('hiding scrollbars of element:', scrollRootElement);
    this._originalOverflow = await this._jsExecutor.executeScript("var origOF = arguments[0].style.overflow; arguments[0].style.overflow='hidden'; return origOF;", scrollRootElement);
  }

  /**
   * @param {EyesWebDriver} driver
   * @return {Promise}
   */
  async returnToOriginalOverflow(driver) {
    const scrollRootElement = await this.getForceScrollRootElement(driver);
    this._logger.verbose('returning overflow of element to its original value:', scrollRootElement);
    await this._jsExecutor.executeScript(`arguments[0].style.overflow='${this._originalOverflow}';`, scrollRootElement);
  }

  /**
   * @param {EyesWebDriver} driver
   * @return {Promise}
   */
  async returnToOriginalPosition(driver) {
    const scrollRootElement = await this.getForceScrollRootElement(driver);
    const positionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor, scrollRootElement);
    await positionProvider.restoreState(this._positionMemento);
  }
}

exports.Frame = Frame;
