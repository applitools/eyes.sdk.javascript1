'use strict';

const { ArgumentGuard, Location } = require('@applitools/eyes-common');
const { PositionProvider } = require('@applitools/eyes-sdk-core');

const { ElementPositionMemento } = require('./ElementPositionMemento');
const { EyesWebElement } = require('../wrappers/EyesWebElement');

class ElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger
   * @param {EyesWebDriver} driver
   * @param {EyesWebElement} element
   */
  constructor(logger, driver, element) {
    super();

    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(driver, 'driver');
    ArgumentGuard.notNull(element, 'element');

    this._logger = logger;
    this._element = element instanceof EyesWebElement ? element : new EyesWebElement(logger, driver, element);

    this._logger.verbose('creating ElementPositionProvider');
  }

  /**
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose('getCurrentScrollPosition()');
    const location = await this._element.getScrollLocation();
    this._logger.verbose('Current position:', location);
    return location;
  }

  /**
   * @inheritDoc
   */
  async setPosition(location) {
    this._logger.verbose('Scrolling element to:', location);
    const result = await this._element.scrollTo(location);
    this._logger.verbose('Done scrolling element! result:', result);
    return result;
  }

  /**
   * @inheritDoc
   */
  async getEntireSize() {
    this._logger.verbose('enter');
    const scrollSize = await this._element.getScrollSize();
    this._logger.verbose('Entire size:', scrollSize);
    return scrollSize;
  }

  /**
   * @inheritDoc
   * @return {Promise<ElementPositionMemento>}
   */
  async getState() {
    const position = await this.getCurrentPosition();
    return new ElementPositionMemento(position);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {ElementPositionMemento} state - The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    const newLocation = new Location(state.getX(), state.getY());
    await this.setPosition(newLocation);
    this._logger.verbose('Position restored.');
  }

  /**
   * @return {WebElement}
   */
  getScrolledElement() {
    return this._element;
  }
}

exports.ElementPositionProvider = ElementPositionProvider;
