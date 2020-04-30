'use strict'

const {ArgumentGuard} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const CssTranslatePositionMemento = require('./CssTranslatePositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslatePositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    super()

    this._logger = logger
    this._executor = executor

    this._lastSetPosition = undefined
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    this._logger.verbose('position to return: ', this._lastSetPosition)
    return this._lastSetPosition
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location) {
    ArgumentGuard.notNull(location, 'location')

    this._logger.verbose(`CssTranslatePositionProvider - Setting position to: ${location}`)

    await EyesUtils.translateTo(this._logger, this._executor, location, this._element)
    this._logger.verbose('Done!')
    this._lastSetPosition = location
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = await EyesUtils.getCurrentFrameContentEntireSize(this._logger, this._executor)
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * @override
   * @return {Promise.<CssTranslatePositionMemento>}
   */
  async getState() {
    const transforms = await EyesUtils.getTransforms(this._logger, this._executor)
    this._logger.verbose('Current transform', transforms)
    return new CssTranslatePositionMemento(transforms, this._lastSetPosition)
  }

  /**
   * @override
   * @param {CssTranslatePositionMemento} state The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    await EyesUtils.setTransforms(this._logger, this._executor, state.transform)
    this._logger.verbose('Transform (position) restored.')
    this._lastSetPosition = state.position
  }
}

module.exports = CssTranslatePositionProvider
