'use strict'

const {
  GetAccessibilityRegion,
  Location,
  CoordinatesType,
  AccessibilityMatchSettings,
  locatorToPersistedRegions,
} = require('@applitools/eyes-sdk-core')

/**
 * @ignore
 */
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
   * @inheritDoc
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<AccessibilityMatchSettings[]>}
   */
  async getRegion(eyes, screenshot) {
    const elements = await eyes.getDriver().findElements(this._selector)

    const values = []
    if (elements && elements.length > 0) {
      for (let i = 0; i < elements.length; i += 1) {
        const rect = await elements[i].getRect()
        const lTag = screenshot.convertLocation(
          new Location(rect),
          CoordinatesType.CONTEXT_RELATIVE,
          CoordinatesType.SCREENSHOT_AS_IS,
        )
        const accessibilityRegion = new AccessibilityMatchSettings({
          left: lTag.getX(),
          top: lTag.getY(),
          width: rect.width,
          height: rect.height,
          type: this._regionType,
        })
        values.push(accessibilityRegion)
      }
    }

    return values
  }

  async toPersistedRegions(driver) {
    const regions = await locatorToPersistedRegions(this._selector, driver)
    return regions.map(reg => ({
      ...reg,
      accessibilityType: this._regionType,
    }))
  }
}

exports.AccessibilityRegionBySelector = AccessibilityRegionBySelector
