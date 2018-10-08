'use strict';

const { PositionProvider, ArgumentGuard } = require('@applitools/eyes.sdk.core');

const { EyesSeleniumUtils } = require('../EyesSeleniumUtils');
const { CssTranslatePositionMemento } = require('./CssTranslatePositionMemento');

/**
 * A {@link PositionProvider} which is based on CSS translates. This is useful when we want to stitch a page which
 * contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {SeleniumJavaScriptExecutor} executor
   */
  constructor(logger, executor) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(executor, 'executor');
    super();

    this._logger = logger;
    this._executor = executor;
    /** @type {Location} */
    this._lastSetPosition = undefined;

    this._logger.verbose('creating CssTranslatePositionProvider');
  }

  /** @inheritDoc */
  async getCurrentPosition() {
    this._logger.verbose('position to return: ', this._lastSetPosition);
    return this._lastSetPosition;
  }

  /** @inheritDoc */
  async setPosition(location) {
    ArgumentGuard.notNull(location, 'location');

    this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`);
    await EyesSeleniumUtils.translateTo(this._executor, location);
    this._logger.verbose('Done!');
    this._lastSetPosition = location;
  }

  /** @inheritDoc */
  async getEntireSize() {
    const entireSize = await EyesSeleniumUtils.getCurrentFrameContentEntireSize(this._executor);
    this._logger.verbose(`CssTranslatePositionProvider - Entire size: ${entireSize}`);
    return entireSize;
  }

  /**
   * @override
   * @return {Promise<CssTranslatePositionMemento>}
   */
  async getState() {
    const transforms = await EyesSeleniumUtils.getCurrentTransform(this._executor)
    this._logger.verbose('Current transform', transforms);
    return new CssTranslatePositionMemento(transforms, this._lastSetPosition);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @override
   * @param {CssTranslatePositionMemento} state The initial state of position
   * @return {Promise<void>}
   */
  async restoreState(state) {
    await EyesSeleniumUtils.setTransforms(this._executor, state.getTransform());
    this._logger.verbose('Transform (position) restored.');
    this._lastSetPosition = state.getPosition();
  }
}

exports.CssTranslatePositionProvider = CssTranslatePositionProvider;
