'use strict'
const GetRegion = require('./GetRegion')

/**
 * @typedef {import('../geometry/Region')} Region
 */

/**
 * @typedef IgnorePersistedRegion
 * @prop {number} left
 * @prop {number} top
 * @prop {number} width
 * @prop {number} height
 */

/**
 * @internal
 */
class IgnoreRegionByRectangle extends GetRegion {
  /**
   * @param {Region} region
   */
  constructor(region) {
    super()
    this._region = region
  }
  /**
   * @return {Promise<Region[]>}
   */
  async getRegion() {
    return [this._region]
  }
  /**
   * @return {Promise<IgnorePersistedRegion[]>}
   */
  async toPersistedRegions() {
    return [this._region.toJSON()]
  }
}

module.exports = IgnoreRegionByRectangle
