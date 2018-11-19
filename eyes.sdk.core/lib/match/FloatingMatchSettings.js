'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { Region } = require('../geometry/Region');

/**
 * Encapsulates floating match settings for the a session.
 */
class FloatingMatchSettings {
  /**
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    this._left = left;
    this._top = top;
    this._width = width;
    this._height = height;
    this._maxUpOffset = maxUpOffset;
    this._maxDownOffset = maxDownOffset;
    this._maxLeftOffset = maxLeftOffset;
    this._maxRightOffset = maxRightOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
  * @protected
  * @return {number} 
  */
  getLeft() {
    return this._left;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value 
    */
  setLeft(value) {
    this._left = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
   * @protected
   * @return {number}
   */
  getTop() {
    return this._top;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
   * @protected
   * @param {number} value 
   */
  setTop(value) {
    this._top = value;
  }

  /** 
    * @protected
    * @return {number}
    */
  getWidth() {
    return this._width;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value 
    */
  setWidth(value) {
    this._width = value;
  }

  /** 
   * @protected
   * @return {number} 
   */
  getHeight() {
    return this._height;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value 
    */
  setHeight(value) {
    this._height = value;
  }

  /**
    * @protected
    * @return {number} 
    */
  getMaxUpOffset() {
    return this._maxUpOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value
    */
  setMaxUpOffset(value) {
    this._maxUpOffset = value;
  }

  /** 
    * @protected
    * @return {number} 
    */
  getMaxDownOffset() {
    return this._maxDownOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value
    */
  setMaxDownOffset(value) {
    this._maxDownOffset = value;
  }

  /** 
    * @protected
    * @return {number}
    */
  getMaxLeftOffset() {
    return this._maxLeftOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
  * @protected
  * @param {number} value
  */
  setMaxLeftOffset(value) {
    this._maxLeftOffset = value;
  }

  /** 
    * @protected
    * @return {number}
    */
  getMaxRightOffset() {
    return this._maxRightOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
    * @protected
    * @param {number} value 
    */
  setMaxRightOffset(value) {
    this._maxRightOffset = value;
  }

  /** 
     * @protected
     * @return {Region} 
     */
  getRegion() {
    return new Region(this._left, this._top, this._width, this._height);
  }

  /** 
    * @protected
    * @override
    */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** 
    * @protected
    * @override 
    */
  toString() {
    return `FloatingMatchSettings { ${JSON.stringify(this)} }`;
  }
}

exports.FloatingMatchSettings = FloatingMatchSettings;
