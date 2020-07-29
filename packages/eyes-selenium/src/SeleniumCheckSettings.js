const {DriverCheckSettings} = require('@applitools/eyes-sdk-core')
const SeleniumWrappedElement = require('./SeleniumWrappedElement')
const SeleniumFrame = require('./SeleniumFrame')

/**
 * @typedef {import('./SpecWrappedElement').Element} Element
 * @typedef {import('./SpecWrappedElement').Selector} Selector
 *
 * @typedef {import('@applitools/eyes-sdk-core').SpecCheckSettings<Element, Selector>} SeleniumSpecCheckSettings
 */

/** @type {SeleniumSpecCheckSettings} */
const SpecCheckSettings = {
  isSelector(selector) {
    return SeleniumWrappedElement.isSelector(selector)
  },
  isCompatibleElement(element) {
    return SeleniumWrappedElement.isCompatible(element)
  },
  createElementFromSelector(selector) {
    return SeleniumWrappedElement.fromSelector(selector)
  },
  createElementFromElement(element) {
    return SeleniumWrappedElement.fromElement(element)
  },
  isFrameReference(reference) {
    return SeleniumFrame.isReference(reference)
  },
  createFrameReference(reference) {
    return SeleniumFrame.fromReference(reference) 
  },
}
/**
  *  @class SeleniumCheckSettings
  *  @instantiate SeleniumCheckSettings from DriverCheckSettings
*/
const CheckSettings = DriverCheckSettings.specialize(SpecCheckSettings)

module.exports = CheckSettings
