'use strict'

const {CoordinatesType, Region} = require('@applitools/eyes-common')
const {GetRegion} = require('./GetRegion')
const EyesUtils = require('../EyesUtils')

class IgnoreRegionBySelector extends GetRegion {
  /**
   * @param {By} selector
   */
  constructor(selector) {
    super()
    this._selector = selector
  }

  /**
   * @override
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   */
  async getRegion(eyes, screenshot) {
    const elements = await eyes.getDriver().finder.findElements(this._selector)
    const regions = []
    for (const element of elements) {
      const rect = await element.getRect()
      const lTag = screenshot.convertLocation(
        rect.getLocation(),
        CoordinatesType.CONTEXT_RELATIVE,
        CoordinatesType.SCREENSHOT_AS_IS,
      )
      regions.push(new Region(lTag.getX(), lTag.getY(), rect.getWidth(), rect.getHeight()))
    }
    return regions
  }

  async toPersistedRegions(driver) {
    return EyesUtils.locatorToPersistedRegions(driver._logger, driver, this._selector)
  }
}

module.exports = IgnoreRegionBySelector
