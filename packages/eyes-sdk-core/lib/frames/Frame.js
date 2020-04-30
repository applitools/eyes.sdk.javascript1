'use strict'

const {ArgumentGuard} = require('@applitools/eyes-common')
const {EyesJsBrowserUtils} = require('../EyesJsBrowserUtils')
const {EyesWrappedElement} = require('../wrappers/EyesWrappedElement')
/**
 * @typedef {import('@applitools/eyes-common').Logger} Logger
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 * @typedef {import('../wrappers/EyesWrappedElement').EyesWrappedElement} EyesWrappedElement
 */

/**
 * Encapsulates a frame/iframe. This is a generic type class,
 * and it's actual type is determined by the element used by the user in
 * order to switch into the frame.
 */
class Frame {
  /**
   * Copy constructor
   * @param {Logger} logger logger instance.
   * @param {Frame} frameOrComponents frame to make copy
   */
  /**
   * Create frame from components
   * @param {Logger} logger logger instance.
   * @param {Object} frameOrComponents frame components
   * @param {EyesWrappedElement} frameOrComponents.element frame element, used as a element to switch into the frame.
   * @param {Location} frameOrComponents.location location of the frame within the current frame.
   * @param {RectangleSize} frameOrComponents.size frame element size (i.e., the size of the frame on the screen, not the internal document size).
   * @param {RectangleSize} frameOrComponents.innerSize The frame element inner size (i.e., the size of the frame actual size, without borders).
   * @param {Location} frameOrComponents.originalLocation The scroll location of the frame.
   * @param {string} frameOrComponents.originalOverflow The original overflow value of the frame.
   */
  constructor(logger, frameOrComponents) {
    ArgumentGuard.notNull(logger, 'logger')
    this._logger = logger
    if (frameOrComponents instanceof Frame) {
      const frame = frameOrComponents
      this._logger.verbose(`Frame copy constructor (${frame})`)
      this._logger = frame._logger
      this._driver = frame._driver
      this._element = frame._element
      this._location = frame._location
      this._size = frame._size
      this._innerSize = frame._innerSize
      this._originalLocation = frame._originalLocation
      this._originalOverflow = frame._originalOverflow
      this._scrollRootElement = frame._scrollRootElement
    } else {
      const components = frameOrComponents
      ArgumentGuard.hasProperties(components, [
        'driver',
        'element',
        'location',
        'size',
        'innerSize',
        'originalLocation',
      ])
      this._logger.verbose(`Frame constructor (${components})`)
      this._driver = components.driver
      this._element = components.element
      this._location = components.location
      this._size = components.size
      this._innerSize = components.innerSize
      this._originalLocation = components.originalLocation
      this._originalOverflow = components.originalOverflow
    }
  }

  static equals(leftFrame, rightFrame) {
    let leftElement = null
    if (leftFrame instanceof Frame) leftElement = leftFrame.element
    else if (leftFrame instanceof EyesWrappedElement) leftElement = leftFrame
    let rightElement = null
    if (rightFrame instanceof Frame) rightElement = rightFrame.element
    else if (rightFrame instanceof EyesWrappedElement) rightElement = rightFrame

    if (!leftElement || !rightElement) return false
    return leftElement.equals(rightElement)
  }

  /**
   * @return {EyesWrappedElement}
   */
  get element() {
    return this._element
  }

  /**
   * @return {Location}
   */
  get location() {
    return this._location
  }

  /**
   * @return {RectangleSize}
   */
  get size() {
    return this._size
  }

  /**
   * @return {RectangleSize}
   */
  get innerSize() {
    return this._innerSize
  }

  /**
   * @return {Location}
   */
  get originalLocation() {
    return this._originalLocation
  }

  /**
   * @return {string}
   */
  get originalOverflow() {
    return this._originalOverflow
  }

  /**
   * @return {EyesWrappedElement}
   */
  get scrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @param {EyesWrappedElement} scrollRootElement
   */
  set scrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @return {Promise<void>}
   */
  async hideScrollbars() {
    const scrollRootElement = await this._getForceScrollRootElement()
    this._logger.verbose('hiding scrollbars of element:', scrollRootElement.unwrapped)
    this._originalOverflow = await EyesJsBrowserUtils.hideScrollbars(
      this._driver.executor,
      200,
      scrollRootElement,
    )
  }

  /**
   * @return {Promise<void>}
   */
  async restoreScrollbars() {
    const scrollRootElement = await this._getForceScrollRootElement()
    this._logger.verbose(
      'returning overflow of element to its original value:',
      scrollRootElement.unwrapped,
    )
    await scrollRootElement.setOverflow(this._originalOverflow)
  }

  /**
   * @private
   * @return {Promise<EyesWrappedElement>}
   */
  async _getForceScrollRootElement() {
    if (!this._scrollRootElement) {
      this._logger.verbose('no scroll root element. selecting default.')
      this._scrollRootElement = await this._driver.finder.findElement({
        using: 'css selector',
        value: 'html',
      })
    }
    return this._scrollRootElement
  }
}

exports.Frame = Frame
