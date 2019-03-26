'use strict';

/**
 * @ignore
 */
class FrameLocator {
  constructor() {
    /** @type {WebElement} */
    this._frameElement = null;
    /** @type {By} */
    this._frameSelector = null;
    /** @type {string} */
    this._frameNameOrId = undefined;
    /** @type {number} */
    this._frameIndex = undefined;
    /** @type {By} */
    this._scrollRootSelector = undefined;
    /** @type {WebElement} */
    this._scrollRootElement = undefined;
  }

  /**
   * @return {number}
   */
  getFrameIndex() {
    return this._frameIndex;
  }

  /**
   * @param {number} frameIndex
   */
  setFrameIndex(frameIndex) {
    this._frameIndex = frameIndex;
  }

  /**
   * @return {string}
   */
  getFrameNameOrId() {
    return this._frameNameOrId;
  }

  /**
   * @param {string} frameNameOrId
   */
  setFrameNameOrId(frameNameOrId) {
    this._frameNameOrId = frameNameOrId;
  }

  /**
   * @return {By}
   */
  getFrameSelector() {
    return this._frameSelector;
  }

  /**
   * @param {By} frameSelector
   */
  setFrameSelector(frameSelector) {
    this._frameSelector = frameSelector;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {WebElement}
   */
  getFrameElement() {
    return this._frameElement;
  }

  /**
   * @param {WebElement} frameElement
   */
  setFrameElement(frameElement) {
    this._frameElement = frameElement;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {WebElement}
   */
  getScrollRootElement() {
    return this._scrollRootElement;
  }

  /**
   * @param {WebElement} scrollRootElement
   */
  setScrollRootElement(scrollRootElement) {
    this._scrollRootElement = scrollRootElement;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {By}
   */
  getScrollRootSelector() {
    return this._scrollRootSelector;
  }

  /**
   * @param {By} scrollRootSelector
   */
  setScrollRootSelector(scrollRootSelector) {
    this._scrollRootSelector = scrollRootSelector;
  }
}

exports.FrameLocator = FrameLocator;
