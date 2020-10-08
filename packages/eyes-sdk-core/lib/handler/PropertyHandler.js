'use strict'

/* eslint-disable no-unused-vars */

/**
 * Encapsulates getter/setter behavior. (e.g., set only once etc.).
 *
 * @abstract
 */
class PropertyHandler {
  /**
   * @param {*} obj - The object to set.
   * @return {boolean} {@code true} if the object was set, {@code false} otherwise.
   */
  set(obj) {}

  /**
   * @return {*} - The object that was set. (Note that object might also be set in the constructor of an impl class).
   */
  get() {}
}

module.exports = PropertyHandler
