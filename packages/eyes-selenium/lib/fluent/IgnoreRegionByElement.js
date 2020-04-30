'use strict'

const {
  GetRegion,
  Location,
  Region,
  CoordinatesType,
  EyesJsBrowserUtils,
} = require('@applitools/eyes-sdk-core')
const {SelectorByElement} = require('./SelectorByElement')

/**
 * @ignore
 */
class IgnoreRegionByElement extends GetRegion {
  /**
   * @param {WebElement} webElement
   */
  constructor(webElement) {
    super()
    this._element = webElement
  }

  /**
   * @override
   * @param {Eyes} eyes
   * @param {EyesScreenshot} screenshot
   * @return {Promise<Region[]>}
   */
  // eslint-disable-next-line no-unused-vars
  async getRegion(eyes, screenshot) {
    const rect = await this._element.getRect()
    const lTag = screenshot.convertLocation(
      new Location(rect),
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    return [new Region(lTag.getX(), lTag.getY(), rect.width, rect.height)]
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(eyes) {
    // eslint-disable-line no-unused-vars
    return new SelectorByElement(this._element).getSelector(eyes)
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesJsBrowserUtils.getElementXpath(driver, this._element)
    return [{type: 'xpath', selector: xpath}]
  }
}

exports.IgnoreRegionByElement = IgnoreRegionByElement
