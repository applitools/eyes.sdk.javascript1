'use strict'

const {ArgumentGuard, Location} = require('../..')
const PositionProvider = require('./PositionProvider')
const PositionMemento = require('./PositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../geometry/RectangleSize').RectangleSize} RectangleSize
 * @typedef {import('../wrappers/EyesJsExecutor')} EyesJsExecutor
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 */

/**
 * A {@link PositionProvider} which is based on Scroll
 */
class ScrollElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger - logger instance
   * @param {EyesJsExecutor} executor - js executor
   * @param {EyesWrappedElement} element - scrolling element
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
   * @return {EyesWrappedElement} scroll root element
   */
  get scrollRootElement() {
    return this._element
  }

  /**
   * Get scroll position of the provided element
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   */
  async getCurrentPosition(customScrollRootElement) {
    try {
      this._logger.verbose('ScrollElementPositionProvider - getCurrentPosition()')
      const position = await EyesUtils.getScrollLocation(
        this._logger,
        this._executor,
        customScrollRootElement || this._element,
      )
      this._logger.verbose(`Current position: ${position}`)
      return position
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to extract current scroll position!`, err)
      return Location.ZERO
    }
  }

  /**
   * Set scroll position of the provided element
   * @param {Location} position - position to set
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   * @return {Location} actual position after set
   */
  async setPosition(position, customScrollRootElement) {
    try {
      ArgumentGuard.notNull(position, 'position')
      this._logger.verbose(`ScrollElementPositionProvider - Scrolling to ${position}`)
      await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        position,
        customScrollRootElement || this._element,
      )
      this._logger.verbose('ScrollElementPositionProvider - Done scrolling!')
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`, err)
    }
  }

  /**
   * Returns entire size of the scrolling element
   * @return {RectangleSize} container's entire size
   */
  async getEntireSize() {
    const size = await EyesUtils.getElementEntireSize(this._logger, this._executor, this._element)
    this._logger.verbose(`ScrollElementPositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * Add "data-applitools-scroll" attribute to the scrolling element
   */
  async markScrollRootElement() {
    try {
      await EyesUtils.markScrollRootElement(this._logger, this._executor, this._element)
    } catch (err) {
      this._logger.verbose("Can't set data attribute for element", err)
    }
  }

  /**
   * Returns current position of the scrolling element for future restoring
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   * @return {Promise<PositionMemento>} current state of scrolling element
   */
  async getState(customScrollRootElement) {
    const position = await this.getCurrentPosition(customScrollRootElement)
    return new PositionMemento({position})
  }

  /**
   * Restore position of the element from the state
   * @param {PositionMemento} state - initial state of position
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   * @return {Promise}
   */
  async restoreState(state) {
    await this.setPosition(state.position)
    this._logger.verbose('Position restored.')
  }
}

module.exports = ScrollElementPositionProvider
