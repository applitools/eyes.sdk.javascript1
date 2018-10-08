'use strict';

const { ArgumentGuard, PositionProvider, Location } = require('@applitools/eyes.sdk.core');

const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');
const { ScrollPositionMemento } = require('./ScrollPositionMemento');
const { EyesDriverOperationError } = require('../errors/EyesDriverOperationError');

class ScrollPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor) {
    super();

    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(executor, 'executor');

    this._logger = logger;
    this._executor = executor;

    this._logger.verbose('creating ScrollPositionProvider');
  }

  /** @inheritDoc */
  async getCurrentPosition() {
    this._logger.verbose('ScrollPositionProvider - getCurrentPosition()');

    try {
      const result = await EyesSeleniumUtils.getCurrentScrollPosition(this._executor);
      this._logger.verbose(`Current position: ${result}`);
      return result;
    } catch (err) {
      throw new EyesDriverOperationError('Failed to extract current scroll position!', err);
    }
  }

  /** @inheritDoc */
  async setPosition(location) {
    this._logger.verbose(`ScrollPositionProvider - Scrolling to ${location}`);
    await EyesSeleniumUtils.setCurrentScrollPosition(this._executor, location);
    this._logger.verbose('ScrollPositionProvider - Done scrolling!');
  }

  /** @inheritDoc */
  async getEntireSize() {
    const result = await EyesSeleniumUtils.getCurrentFrameContentEntireSize(this._executor);
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${result}`);
    return result;
  }

  /**
   * @override
   * @return {Promise<ScrollPositionMemento>}
   */
  async getState() {
    const position = await this.getCurrentPosition();
    return new ScrollPositionMemento(position);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {ScrollPositionMemento} state The initial state of position
   * @return {Promise<void>}
   */
  async restoreState(state) {
    await this.setPosition(new Location(state.getX(), state.getY()));
    this._logger.verbose('Position restored.');
  }

  /**
   * @return {Promise<void>}
   */
  async scrollToBottomRight() {
    return EyesSeleniumUtils.scrollToBottomRight(this._executor);
  }
}

exports.ScrollPositionProvider = ScrollPositionProvider;
