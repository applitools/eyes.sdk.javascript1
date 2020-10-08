'use strict'
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')
const AccessibilityRegionTypes = require('../config/AccessibilityRegionType')
const ArgumentGuard = require('../utils/ArgumentGuard')

/**
 * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
 */

/**
 * @typedef AccessibilityPersistedRegion
 * @prop {number} left
 * @prop {number} top
 * @prop {number} width
 * @prop {number} height
 * @prop {AccessibilityRegionType} accessibilityType
 */

/**
 * @internal
 */
class AccessibilityRegionByRectangle extends GetAccessibilityRegion {
  /**
   * @param {Region} rect
   * @param {AccessibilityRegionType} [type]
   */
  constructor(rect, type) {
    super()
    ArgumentGuard.isValidEnumValue(type, AccessibilityRegionTypes, false)
    this._rect = rect
    this._type = type
  }
  /**
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion() {
    const accessibilityRegion = new AccessibilityMatchSettings({
      left: this._rect.getLeft(),
      top: this._rect.getTop(),
      width: this._rect.getWidth(),
      height: this._rect.getHeight(),
      type: this._type,
    })
    return [accessibilityRegion]
  }
  /**
   * @return {Promise<AccessibilityPersistedRegion[]>}
   */
  async toPersistedRegions() {
    return [
      {
        left: this._rect.getLeft(),
        top: this._rect.getTop(),
        width: this._rect.getWidth(),
        height: this._rect.getHeight(),
        accessibilityType: this._type,
      },
    ]
  }
}

module.exports = AccessibilityRegionByRectangle
