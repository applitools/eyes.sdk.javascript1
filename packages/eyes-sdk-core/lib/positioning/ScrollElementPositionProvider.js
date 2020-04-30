'use strict'

const {ArgumentGuard, Location} = require('@applitools/eyes-common')
const PositionProvider = require('./PositionProvider')
const ScrollPositionMemento = require('./ScrollPositionMemento')
const EyesUtils = require('../EyesUtils')

class ScrollElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger A Logger instance.
   * @param {EyesJsExecutor} executor
   */
  constructor(logger, executor, element) {
    super()

    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    ArgumentGuard.notNull(element, 'element')

    this._logger = logger
    this._executor = executor
    this._element = element
  }

  /**
   *
   * @returns {EyesWrappedElement}
   */
  get element() {
    return this._element
  }

  /**
   * @override
   * @inheritDoc
   */
  async getCurrentPosition() {
    try {
      this._logger.verbose('ScrollElementPositionProvider - getCurrentPosition()')
      const location = await EyesUtils.getScrollLocation(
        this._logger,
        this._executor,
        this._element,
      )
      this._logger.verbose(`Current position: ${location}`)
      return location
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to extract current scroll position!`)
      return Location.ZERO
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async setPosition(location) {
    try {
      this._logger.verbose(`ScrollElementPositionProvider - Scrolling to ${location}`)
      await EyesUtils.scrollTo(this._logger, this._executor, location, this._element)
      this._logger.verbose('ScrollElementPositionProvider - Done scrolling!')
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`)
    }
  }

  /**
   * @override
   * @inheritDoc
   */
  async getEntireSize() {
    const size = await EyesUtils.getElementEntireSize(this._logger, this._executor, this._element)
    this._logger.verbose(`ScrollElementPositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * @override
   * @return {Promise.<ScrollPositionMemento>}
   */
  async getState() {
    const location = await this.getCurrentPosition()
    return new ScrollPositionMemento(location)
  }

  /**
   * @override
   * @param {ScrollPositionMemento} state The initial state of position
   * @return {Promise}
   */
  async restoreState(state) {
    await this.setPosition(new Location(state.getX(), state.getY()))
    this._logger.verbose('Position restored.')
  }
}

module.exports = ScrollElementPositionProvider
