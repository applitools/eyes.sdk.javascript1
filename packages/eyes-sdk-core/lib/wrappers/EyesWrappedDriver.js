'use strict'
/* eslint-disable no-unused-vars */

/**
 * @typedef {import('./EyesJsExecutor').EyesJsExecutor} EyesJsExecutor
 * @typedef {import('./EyesBrowsingContext').EyesBrowsingContext} EyesBrowsingContext
 * @typedef {import('./EyesElementFinder').EyesElementFinder} EyesElementFinder
 */

/**
 * An interface for driver wrappers
 *
 * @ignore
 * @interface
 */
class EyesWrappedDriver {
  /**
   * @return {Object} unwrapped driver for specific SDK
   */
  get unwrapped() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesJsExecutor} implementation of JavaScript executor interface for specific SDK
   */
  get executor() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesBrowsingContext} implementation of browsing context switcher interface for specific SDK
   */
  get context() {
    throw new TypeError('The method is not implemented!')
  }
  /**
   * @return {EyesElementFinder} implementation of element finder interface for specific SDK
   */
  get finder() {
    throw new TypeError('The method is not implemented!')
  }
}

exports.EyesWrappedDriver = EyesWrappedDriver
