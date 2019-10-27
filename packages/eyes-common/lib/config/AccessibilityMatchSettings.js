'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');
const { Region } = require('../geometry/Region');
const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { AccessibilityRegionType } = require('./AccessibilityRegionType');

/**
 * Encapsulates Accessibility match settings.
 */
class AccessibilityMatchSettings {
  /**
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {AccessibilityRegionType} [type]
   */
  constructor({ left, top, width, height, type } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }
    ArgumentGuard.isValidEnumValue(type, AccessibilityRegionType, false);

    this._left = left;
    this._top = top;
    this._width = width;
    this._height = height;
    this._type = type;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number}
   */
  getLeft() {
    return this._left;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setLeft(value) {
    this._left = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {number}
   */
  getTop() {
    return this._top;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setTop(value) {
    this._top = value;
  }

  /**
   * @return {number}
   */
  getWidth() {
    return this._width;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setWidth(value) {
    this._width = value;
  }

  /**
   * @return {number}
   */
  getHeight() {
    return this._height;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setHeight(value) {
    this._height = value;
  }

  /**
   * @return {AccessibilityRegionType}
   */
  getType() {
    return this._type;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {AccessibilityRegionType} value
   */
  setType(value) {
    ArgumentGuard.isValidEnumValue(value, AccessibilityRegionType);
    this._type = value;
  }

  /**
   * @return {Region}
   */
  getRegion() {
    return new Region(this._left, this._top, this._width, this._height);
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    return `AccessibilityMatchSettings { ${JSON.stringify(this)} }`;
  }
}

exports.AccessibilityMatchSettings = AccessibilityMatchSettings;
