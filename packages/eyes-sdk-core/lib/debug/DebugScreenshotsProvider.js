'use strict'
const DEFAULT_PREFIX = 'screenshot_'
const DEFAULT_PATH = ''

/**
 * Interface for saving debug screenshots!
 * @abstract
 */
class DebugScreenshotsProvider {
  constructor() {
    this._prefix = DEFAULT_PREFIX
    this._path = null
  }

  /**
   * @return {string}
   */
  getPrefix() {
    return this._prefix
  }

  /**
   * @param {string} value
   */
  setPrefix(value) {
    this._prefix = value || DEFAULT_PREFIX
  }

  /**
   * @return {string}
   */
  getPath() {
    return this._path
  }

  /**
   * @param {string} value
   */
  setPath(value) {
    if (value) {
      this._path = value.endsWith('/') ? value : `${value}/`
    } else {
      this._path = DEFAULT_PATH
    }
  }

  /**
   * @abstract
   * @param {MutableImage} image
   * @param {string} suffix
   * @return {Promise}
   */
  async save(_image, _suffix) {
    // eslint-disable-line no-unused-vars
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = DebugScreenshotsProvider
