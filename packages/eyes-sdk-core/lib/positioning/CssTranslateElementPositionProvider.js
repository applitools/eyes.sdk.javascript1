'use strict'
const {ArgumentGuard} = require('../utils/ArgumentGuard')
const {Location} = require('../geometry/Location')
const PositionProvider = require('./PositionProvider')
const PositionMemento = require('./PositionMemento')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../geometry/RectangleSize').RectangleSize} RectangleSize
 * @typedef {import('../wrappers/EyesJsExecutor')} EyesJsExecutor
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 */

/**
 * A {@link PositionProvider} which is based on CSS translates. This is
 * useful when we want to stitch a page which contains fixed position elements.
 */
class CssTranslateElementPositionProvider extends PositionProvider {
  /**
   * @param {Logger} logger - logger instance
   * @param {EyesJsExecutor} executor - js executor
   * @param {EyesWrappedElement} element - scrolling element
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
   * @return {EyesWrappedElement} scroll root element
   */
  get scrollRootElement() {
    return this._element
  }

  /**
   * Get position of the provided element using css translate algorithm
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   */
  async getCurrentPosition(customScrollRootElement) {
    try {
      const [scrollPosition, translatePosition] = await Promise.all([
        EyesUtils.getScrollLocation(
          this._logger,
          this._executor,
          customScrollRootElement || this._element,
        ),
        EyesUtils.getTranslateLocation(
          this._logger,
          this._executor,
          customScrollRootElement || this._element,
        ),
      ])
      return scrollPosition.offsetByLocation(translatePosition)
    } catch (err) {
      // Sometimes it is expected e.g. on Appium, otherwise, take care
      this._logger.verbose(`Failed to set current scroll position!.`, err)
      return Location.ZERO
    }
  }

  /**
   * Set position of the provided element using css translate algorithm
   * @param {Location} position - position to set
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   * @return {Location} actual position after set
   */
  async setPosition(position, customScrollRootElement) {
    try {
      ArgumentGuard.notNull(position, 'position')
      const actualScrollPosition = await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        position,
        customScrollRootElement || this._element,
      )
      const outOfBoundsPosition = position.offsetNegative(actualScrollPosition)
      const actualTranslatePosition = await EyesUtils.translateTo(
        this._logger,
        this._executor,
        outOfBoundsPosition,
        customScrollRootElement || this._element,
      )

      return actualScrollPosition.offsetByLocation(actualTranslatePosition)
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
    const size = await EyesUtils.getElementEntireSize(this._logger, this._executor, this._element)
    this._logger.verbose(`CssTranslatePositionProvider - Entire size: ${size}`)
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
    try {
      const position = await EyesUtils.getScrollLocation(
        this._logger,
        this._executor,
        customScrollRootElement || this._element,
      )
      const transforms = await EyesUtils.getTransforms(
        this._logger,
        this._executor,
        customScrollRootElement || this._element,
      )
      this._logger.verbose('Current transform', transforms)
      return new PositionMemento({transforms, position})
    } catch (err) {
      this._logger.verbose(`Failed to get current transforms!.`, err)
      return new PositionMemento({})
    }
  }

  /**
   * Restore position of the element from the state
   * @param {PositionMemento} state - initial state of position
   * @param {EyesWrappedElement} [customScrollRootElement] - if custom scroll root element provided
   *  it will be user as a base element for this operation
   * @return {Promise}
   */
  async restoreState(state, customScrollRootElement) {
    try {
      await EyesUtils.scrollTo(
        this._logger,
        this._executor,
        state.position,
        customScrollRootElement || this._element,
      )
      await EyesUtils.setTransforms(
        this._logger,
        this._executor,
        state.transforms,
        customScrollRootElement || this._element,
      )
      this._logger.verbose('Transform (position) restored.')
    } catch (err) {
      this._logger.verbose(`Failed to restore state!.`, err)
    }
  }
}

module.exports = CssTranslateElementPositionProvider
