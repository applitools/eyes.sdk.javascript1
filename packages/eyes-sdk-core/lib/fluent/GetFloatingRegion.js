'use strict'

/* eslint-disable no-unused-vars */

/**
 * @ignore
 * @abstract
 */
class GetFloatingRegion {
  /**
   * @param {EyesWrappedDriver} driver
   * @param {EyesScreenshot} screenshot
   * @return {Promise<FloatingMatchSettings[]>}
   */
  async getRegion(driver, screenshot) {
    throw new TypeError('The method is not implemented!')
  }
}

exports.GetFloatingRegion = GetFloatingRegion
