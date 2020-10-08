'use strict'

const PropertyHandler = require('./PropertyHandler')

/**
 * A simple implementation of {@link PropertyHandler}. Allows get/set.
 */
class SimplePropertyHandler extends PropertyHandler {
  /**
   * @param {object} [obj] - The object to set.
   */
  constructor(obj) {
    super()
    this._obj = obj || null
  }

  /**
   * @inheritDoc
   */
  set(obj) {
    this._obj = obj
    return true
  }

  /**
   * @inheritDoc
   */
  get() {
    return this._obj
  }
}

module.exports = SimplePropertyHandler
