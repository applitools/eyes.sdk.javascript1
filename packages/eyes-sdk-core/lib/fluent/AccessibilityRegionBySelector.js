'use strict'

const {CoordinatesType, AccessibilityMatchSettings} = require('@applitools/eyes-common')
const {GetAccessibilityRegion} = require('./GetAccessibilityRegion')
const EyesUtils = require('../EyesUtils')

class AccessibilityRegionBySelector extends GetAccessibilityRegion {
  /**
   * @param {By} regionSelector
   * @param {AccessibilityRegionType} regionType
   */
  constructor(regionSelector, regionType) {
    super()
    this._selector = regionSelector
    this._regionType = regionType
  }

  /**
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
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
      const accessibilityRegion = new AccessibilityMatchSettings({
        left: lTag.getX(),
        top: lTag.getY(),
        width: rect.getWidth(),
        height: rect.getHeight(),
        type: this._regionType,
      })
      regions.push(accessibilityRegion)
    }

    return regions
  }

  async toPersistedRegions(driver) {
    const regions = await EyesUtils.locatorToPersistedRegions(
      driver._logger,
      driver,
      this._selector,
    )
    return regions.map(reg => ({
      ...reg,
      accessibilityType: this._regionType,
    }))
  }
}

module.exports = AccessibilityRegionBySelector
