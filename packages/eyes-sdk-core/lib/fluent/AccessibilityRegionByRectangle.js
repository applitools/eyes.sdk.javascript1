'use strict'

const {AccessibilityMatchSettings, AccessibilityRegionType, ArgumentGuard} = require('../..')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')

/**
 * @ignore
 */
class AccessibilityRegionByRectangle extends GetAccessibilityRegion {
  /**
   * @param {Region} rect
   * @param {AccessibilityRegionType} [type]
   */
  constructor(rect, type) {
    super()
    ArgumentGuard.isValidEnumValue(type, AccessibilityRegionType, false)
    this._rect = rect
    this._type = type
  }

  /**
   * @inheritDoc
   */
  async getRegion(_eyesBase, _screenshot) {
    const accessibilityRegion = new AccessibilityMatchSettings({
      left: this._rect.getLeft(),
      top: this._rect.getTop(),
      width: this._rect.getWidth(),
      height: this._rect.getHeight(),
      type: this._type,
    })
    return [accessibilityRegion]
  }

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

exports.AccessibilityRegionByRectangle = AccessibilityRegionByRectangle
