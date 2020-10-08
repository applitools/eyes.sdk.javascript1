'use strict'
const FloatingMatchSettings = require('../config/FloatingMatchSettings')
const GetFloatingRegion = require('./GetFloatingRegion')

/**
 * @typedef FloatingPersistedRegion
 * @prop {number} left
 * @prop {number} top
 * @prop {number} width
 * @prop {number} height
 * @prop {number} maxUpOffset
 * @prop {number} maxDownOffset
 * @prop {number} maxLeftOffset
 * @prop {number} maxRightOffset
 */

/**
 * @internal
 */
class FloatingRegionByRectangle extends GetFloatingRegion {
  /**
   * @param {Region} rect
   * @param {number} maxUpOffset
   * @param {number} maxDownOffset
   * @param {number} maxLeftOffset
   * @param {number} maxRightOffset
   */
  constructor(rect, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    super()
    this._rect = rect
    this._maxUpOffset = maxUpOffset
    this._maxDownOffset = maxDownOffset
    this._maxLeftOffset = maxLeftOffset
    this._maxRightOffset = maxRightOffset
  }
  /**
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion() {
    const floatingRegion = new FloatingMatchSettings({
      left: this._rect.getLeft(),
      top: this._rect.getTop(),
      width: this._rect.getWidth(),
      height: this._rect.getHeight(),
      maxUpOffset: this._maxUpOffset,
      maxDownOffset: this._maxDownOffset,
      maxLeftOffset: this._maxLeftOffset,
      maxRightOffset: this._maxRightOffset,
    })
    return [floatingRegion]
  }
  /**
   * @return {FloatingPersistedRegion[]}
   */
  async toPersistedRegions() {
    return [
      {
        left: this._rect.getLeft(),
        top: this._rect.getTop(),
        width: this._rect.getWidth(),
        height: this._rect.getHeight(),
        maxUpOffset: this._maxUpOffset,
        maxDownOffset: this._maxDownOffset,
        maxLeftOffset: this._maxLeftOffset,
        maxRightOffset: this._maxRightOffset,
      },
    ]
  }
}

module.exports = FloatingRegionByRectangle
