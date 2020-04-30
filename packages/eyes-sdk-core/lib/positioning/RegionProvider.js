'use strict'

/**
 * Encapsulates a getRegion "callback" and how the region's coordinates should be used.
 */
class RegionProvider {
  /**
   * @param {Region} [region]
   */
  constructor(region) {
    this._region = region
  }

  /**
   * @return {Promise<Region>} - A region with "as is" viewport coordinates.
   */
  async getRegion() {
    return this._region
  }
}

module.exports = RegionProvider
