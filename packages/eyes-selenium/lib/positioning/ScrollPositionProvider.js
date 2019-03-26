'use strict';

const { ArgumentGuard, Location, RectangleSize, EyesError } = require('@applitools/eyes-common');
const { PositionProvider } = require('@applitools/eyes-sdk-core');

const { ScrollPositionMemento } = require('./ScrollPositionMemento');

class ScrollPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger
   * @param {EyesJsExecutor} executor
   * @param {WebElement} scrollRootElement
   */
  constructor(logger, executor, scrollRootElement) {
    super();

    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(executor, 'executor');
    ArgumentGuard.notNull(scrollRootElement, 'scrollRootElement');

    this._logger = logger;
    this._executor = executor;
    this._scrollRootElement = scrollRootElement;

    this._logger.verbose('creating ScrollPositionProvider');
  }

  /**
   * @param {EyesJsExecutor} executor
   * @param {WebElement} scrollRootElement
   * @return {Promise<Location>}
   */
  static async getCurrentPositionStatic(executor, scrollRootElement) {
    try {
      const script = 'return [arguments[0].scrollLeft, arguments[0].scrollTop];';

      const result = await executor.executeScript(script, scrollRootElement);
      return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
    } catch (err) {
      throw new EyesError('Could not get scroll position!', err);
    }
  }

  /**
   * @inheritDoc
   */
  async getCurrentPosition() {
    return await ScrollPositionProvider.getCurrentPositionStatic(this._executor, this._scrollRootElement);
  }

  /**
   * @inheritDoc
   */
  async setPosition(location) {
    try {
      this._logger.verbose(`setting position of ${this._scrollRootElement} to ${location}`);

      const script = `arguments[0].scrollLeft=${location.getX()}; arguments[0].scrollTop=${location.getY()};` +
        'return [arguments[0].scrollLeft, arguments[0].scrollTop];';

      const result = await this._executor.executeScript(script, this._scrollRootElement);
      return new Location(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
    } catch (err) {
      throw new EyesError('Could not get scroll position!', err);
    }
  }

  /**
   * @inheritDoc
   */
  async getEntireSize() {
    this._logger.verbose(`enter`);

    const script = 'var width = Math.max(arguments[0].clientWidth, arguments[0].scrollWidth);' +
      'var height = Math.max(arguments[0].clientHeight, arguments[0].scrollHeight);' +
      'return [width, height];';

    const entireSizeStr = await this._executor.executeScript(script, this._scrollRootElement);
    const result = new RectangleSize(Math.ceil(entireSizeStr[0]) || 0, Math.ceil(entireSizeStr[1]) || 0);
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${result}`);
    return result;
  }

  /**
   * @inheritDoc
   * @return {Promise<ScrollPositionMemento>}
   */
  async getState() {
    const position = await this.getCurrentPosition();
    return new ScrollPositionMemento(position);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {ScrollPositionMemento} state - The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    const newPosition = new Location(state.getX(), state.getY());
    await this.setPosition(newPosition);
  }

  /**
   * @override
   * @return {WebElement}
   */
  getScrolledElement() {
    return this._scrollRootElement;
  }
}

exports.ScrollPositionProvider = ScrollPositionProvider;
