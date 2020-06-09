'use strict'

const {GetSelector} = require('./GetSelector')
const EyesUtils = require('../EyesUtils')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
 */

class TargetRegionByElement extends GetSelector {
  /**
   * @param {EyesWrappedElement} element
   */
  constructor(element) {
    super()
    this._element = element
  }
  /**
   * @param {EyesWrappedDriver} driver
   * @return {Promise<PersistedRegions[]>}
   */
  async toPersistedRegions(driver) {
    await this._element.init(driver)
    const xpath = await EyesUtils.getElementAbsoluteXpath(
      driver._logger,
      driver.executor,
      this._element,
    )
    return [{type: 'xpath', selector: xpath}]
  }
}

module.exports = TargetRegionByElement
