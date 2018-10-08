'use strict';

const { ArgumentGuard, PositionProvider, RectangleSize, Location } = require('@applitools/eyes.sdk.core');

const { ElementPositionMemento } = require('./ElementPositionMemento');
const { EyesWebElement } = require('../wrappers/EyesWebElement');

class ElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver
   * @param {EyesWebElement} element
   */
  constructor(logger, driver, element) {
    super();
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(element, 'element');

    this._logger = logger;
    this._element = element instanceof EyesWebElement ? element : new EyesWebElement(logger, driver, element);

    this._logger.verbose('creating ElementPositionProvider');
  }

  /** @inheritDoc */
  async getCurrentPosition() {
    this._logger.verbose('getCurrentScrollPosition()');
    const scrollLeftValue = await this._element.getScrollLeft();
    const scrollTopValue = await this._element.getScrollTop();
    const location = new Location(scrollLeftValue, scrollTopValue);
    this._logger.verbose(`Current position: ${location}`);
    return location;
  }

  /** @inheritDoc */
  async setPosition(location) {
    this._logger.verbose(`Scrolling element to: ${location}`);
    await this._element.scrollTo(location);
    this._logger.verbose('Done scrolling element!');
  }

  /** @inheritDoc */
  async getEntireSize() {
    this._logger.verbose('ElementPositionProvider - getEntireSize()');
    const scrollWidthValue = await this._element.getScrollWidth();
    const scrollHeightValue = await this._element.getScrollHeight();
    const size = new RectangleSize(scrollWidthValue, scrollHeightValue);
    this._logger.verbose(`ElementPositionProvider - Entire size: ${size}`);
    return size;
  }

  /**
   * @override
   * @return {Promise<ElementPositionMemento>}
   */
  async getState() {
    const position = await this.getCurrentPosition();
    return new ElementPositionMemento(position);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {ElementPositionMemento} state The initial state of position
   * @return {Promise<void>}
   */
  async restoreState(state) {
    await this.setPosition(new Location(state.getX(), state.getY()));
    this._logger.verbose('Position restored.');
  }
}

exports.ElementPositionProvider = ElementPositionProvider;
