'use strict'

const {GeneralUtils} = require('@applitools/eyes-common')
const {GetSelector} = require('./GetSelector')
const EyesUtils = require('../EyesUtils')

const EYES_SELECTOR_TAG = 'data-eyes-selector'

/**
 * @ignore
 */
class TargetRegionByElement extends GetSelector {
  /**
   * @param {WDIOElement|object} element
   */
  constructor(element) {
    super()
    this._element = element
  }

  /**
   * @inheritDoc
   * @param {Eyes} eyes
   * @return {Promise<string>}
   */
  async getSelector(driver) {
    this._element.bind(driver)
    const randId = GeneralUtils.randomAlphanumeric()
    await driver.executor.executeScript(
      `arguments[0].setAttribute('${EYES_SELECTOR_TAG}', '${randId}');`,
      this._element,
    )
    return `[${EYES_SELECTOR_TAG}="${randId}"]`
  }

  async toPersistedRegions(driver) {
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = TargetRegionByElement
