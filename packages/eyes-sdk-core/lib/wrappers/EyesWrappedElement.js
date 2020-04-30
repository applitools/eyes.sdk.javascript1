'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('@applitools/eyes-common').Region} Region
 * @typedef {import('@applitools/eyes-common').Location} Location
 * @typedef {import('@applitools/eyes-common').RectangleSize} RectangleSize
 */

/**
 * The object for which which is compatible with concrete {@link EyesWrappedElement} implementation
 * @typedef {Object} UnwrappedElement
 * @property {*}
 */

/**
 * An interface for element wrappers
 * @ignore
 * @interface
 */
class EyesWrappedElement {
  /**
   * Check if object could be wrapped with this class
   * @param {Object} object
   * @return {boolean} true - object could be wrapped with this class, otherwise - false
   */
  static isCompatible(object) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Compare two elements, these elements could be an instances of this class or compatible objects
   * @param {EyesWrappedElement|UnwrappedElement} leftElement
   * @param {EyesWrappedElement|UnwrappedElement} rightElement
   * @return {boolean} true - elements are equal, otherwise - false
   */
  static equals(leftElement, rightElement) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Extract element ID from this class instance or compatible object
   * @param {EyesWrappedElement|UnwrappedElement} element
   * @return {?string} if extraction is succeed returns ID of provided element, otherwise null
   */
  static elementId(element) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns ID of the wrapped element
   * @return {string} ID of the wrapped element
   */
  get elementId() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns unwrapped elements
   * @return {UnwrappedElement} unwrapped element
   */
  get unwrapped() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns element's rect related to context
   * @return {Promise<Region>} rect of the element
   */
  async getRect() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns element's bounds related to context
   * @return {Promise<Region>} bounds of the element
   */
  async getBounds() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns element's size
   * @return {Promise<RectangleSize>} size of the element
   */
  async getSize() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns element's location related to context
   * @return {Promise<Location>} location of the element
   */
  async getLocation() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns computed values for specified css properties
   * @param  {...string} cssPropertyNames
   * @return {Promise<string[]|string>} returns array of css values if multiple properties were specified,
   *  otherwise returns string
   */
  async getCssProperty(...cssPropertyNames) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns values for specified element's properties
   * @param  {...string} propertyNames
   * @return {Promise<*[]|*>} returns array of values if multiple properties were specified,
   *  otherwise returns value
   */
  async getProperty(...propertyNames) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns element's overflow from style attribute
   * @return {Promise<?string>} returns element's overflow if it was specified, otherwise returns null
   */
  async getOverflow() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Set overflow in element's style attribute
   * @param {?string} overflow
   * @return {Promise<void>}
   */
  async setOverflow(overflow) {
    throw new TypeError('The method is not implemented!')
  }
}

exports.EyesWrappedElement = EyesWrappedElement
