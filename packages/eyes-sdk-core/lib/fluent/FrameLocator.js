'use strict'

class FrameLocator {
  constructor() {
    /** @type {WDIOElement|object} */
    this._frameElement = null
    /** @type {By} */
    this._frameSelector = null
    /** @type {String} */
    this._frameNameOrId = null
    /** @type {Integer} */
    this._frameIndex = null
    /** @type {WDIOElement|object} */
    this._scrollRootElement = undefined
    /** @type {By|string} */
    this._scrollRootSelector = undefined
  }

  /**
   * @return {WDIOElement|object}
   */
  getFrameElement() {
    return this._frameElement
  }

  /**
   * @param {WDIOElement|object} frameElement
   */
  setFrameElement(frameElement) {
    this._frameElement = frameElement
  }

  /**
   * @return {By|string}
   */
  getFrameSelector() {
    return this._frameSelector
  }

  /**
   * @param {By|string} frameSelector
   */
  setFrameSelector(frameSelector) {
    this._frameSelector = frameSelector
  }

  /**
   * @return {String}
   */
  getFrameNameOrId() {
    return this._frameNameOrId
  }

  /**
   * @param {String} frameNameOrId
   */
  setFrameNameOrId(frameNameOrId) {
    this._frameNameOrId = frameNameOrId
  }

  /**
   * @return {Integer}
   */
  getFrameIndex() {
    return this._frameIndex
  }

  /**
   * @param frameIndex
   */
  setFrameIndex(frameIndex) {
    this._frameIndex = frameIndex
  }

  /**
   * @return {WDIOElement|object}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @param {WDIOElement|object} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement
  }

  /**
   * @return {By|string}
   */
  getScrollRootSelector() {
    return this._scrollRootSelector
  }

  /**
   * @param {By|string} scrollRootSelector
   */
  setScrollRootSelector(scrollRootSelector) {
    this._scrollRootSelector = scrollRootSelector
  }
}

module.exports = FrameLocator
