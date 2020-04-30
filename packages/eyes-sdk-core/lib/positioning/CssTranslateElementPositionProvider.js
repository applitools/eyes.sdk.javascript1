'use strict'

const {ArgumentGuard} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const CssTranslatePositionMemento = require('./CssTranslatePositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslateElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor, element) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    ArgumentGuard.notNull(element, 'element')
    super()

    this._logger = logger
    this._executor = executor
    this._element = element
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    const [scrollLocation, translateLocation] = await Promise.all([
      EyesUtils.getScrollLocation(this._logger, this._executor, this._element),
      EyesUtils.getTranslateLocation(this._logger, this._executor, this._element),
    ])
    return scrollLocation.offsetNegative(translateLocation)
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(requiredLocation) {
    ArgumentGuard.notNull(requiredLocation, 'requiredLocation')
    await EyesUtils.scrollTo(this._logger, this._executor, requiredLocation, this._element)
    const currentLocation = await this.getCurrentPosition()
    const outOfBoundsLocation = requiredLocation.offsetNegative(currentLocation)
    const translateLocation = await EyesUtils.getTranslateLocation(
      this._logger,
      this._executor,
      this._element,
    )
    const location = translateLocation.offsetNegative(outOfBoundsLocation)
    await EyesUtils.translateTo(this._logger, this._executor, location, this._element)
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = await EyesUtils.getElementEntireSize(this._logger, this._executor, this._element)
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

module.exports = CssTranslateElementPositionProvider
