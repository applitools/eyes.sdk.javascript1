'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('./EyesWrappedElement').EyesWrappedElement} EyesWrappedElement
 * @typedef {import('./EyesWrappedElement').UnwrappedElement} UnwrappedElement
 */

/**
 * @typedef {Object} UniversalLocator
 * @property {!string} UniversalLocator.using
 * @property {!string} UniversalLocator.value
 */

/**
 * An interface for element finder
 * @ignore
 * @interface
 */
class EyesElementFinder {
  /**
   * Check if passed locator is supported by current implementation
   * @param {*} locator
   * @returns {boolean} true if locator is supported and could be passed in the {@link EyesElementFinder.findElement} implementation
   */
  static isLocator(locator) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns first founded element
   * @param {UniversalLocator} locator locator supported by current implementation
   * @param {EyesWrappedElement|UnwrappedElement} parentElement parent element to search only among child elements
   * @return {Promise<EyesWrappedElement>}
   */
  async findElement(locator, parentElement) {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * Returns all founded element
   * @param {UniversalLocator} locator locator supported by current SDK
   * @param {EyesWrappedElement|UnwrappedElement} parentElement parent element to search only among child elements
   * @return {Promise<EyesWrappedElement[]>}
   */
  async findElements(locator, parentElement) {
    throw new TypeError('The method is not implemented!')
  }
}

exports.EyesElementFinder = EyesElementFinder
