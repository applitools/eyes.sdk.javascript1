'use strict'

const {ArgumentGuard, Location} = require('../..')
const PositionProvider = require('./PositionProvider')
const PositionMemento = require('./PositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * A {@link PositionProvider} which is based on Scroll
 */
class ScrollPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger - logger instance
   * @param {EyesJsExecutor} executor - js executor
   * @param {EyesWrappedElement} [scrollRootElement] - if scrolling element is not provided, default scrolling element will be used
   */
  constructor(logger, executor, scrollRootElement) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')
    super()

    this._logger = logger
    this._executor = executor
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @return {EyesWrappedElement} scroll root element
   */
  get scrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * Get scroll position of the provided element
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   */
  async getCurrentPosition(customScrollRootElement) {
    try {
      this._logger.verbose('ScrollPositionProvider - getCurrentPosition()')
      const position = await EyesUtils.getScrollLocation(
        this._logger,
        this._executor,
        customScrollRootElement || this._scrollRootElement,
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
      this._logger.verbose(`ScrollPositionProvider - Scrolling to ${position}`)
      const actualLocation = await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        position,
        customScrollRootElement || this._scrollRootElement,
      )
      return actualLocation
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`, err)
      return Location.ZERO
    }
  }

  /**
   * Returns entire size of the scrolling element
   * @return {RectangleSize} container's entire size
   */
  async getEntireSize() {
    const size = this._scrollRootElement
      ? await EyesUtils.getElementEntireSize(this._logger, this._executor, this._scrollRootElement)
      : await EyesUtils.getCurrentFrameContentEntireSize(this._logger, this._executor)
    this._logger.verbose(`ScrollPositionProvider - Entire size: ${size}`)
    return size
  }

  /**
   * Add "data-applitools-scroll" attribute to the scrolling element
   */
  async markScrollRootElement() {
    try {
      await EyesUtils.markScrollRootElement(this._logger, this._executor, this._scrollRootElement)
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
  async restoreState(state, customScrollRootElement) {
    await this.setPosition(state.position, customScrollRootElement)
    this._logger.verbose('Position restored.')
  }
}

module.exports = ScrollPositionProvider
