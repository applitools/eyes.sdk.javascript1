'use strict'

const FixedScaleProvider = require('./FixedScaleProvider')
const ScaleProviderFactory = require('./ScaleProviderFactory')

/**
 * @ignore
 */
class FixedScaleProviderFactory extends ScaleProviderFactory {
  /**
   * @param {number} scaleRatio - The scale ratio to use.
   * @param {PropertyHandler} scaleProviderHandler
   */
  constructor(scaleRatio, scaleProviderHandler) {
    super(scaleProviderHandler)

    this._fixedScaleProvider = new FixedScaleProvider(scaleRatio)
  }

  /**
   * The implementation of getting/creating the scale provider, should be implemented by child classes.
   *
   * @param {number} imageToScaleWidth - The width of the image to scale. This parameter CAN be by class implementing the
   *   factory, but this is not mandatory.
   * @return {ScaleProvider} - The scale provider to be used.
   */
  getScaleProviderImpl(_imageToScaleWidth) {
    return this._fixedScaleProvider
  }
}

module.exports = FixedScaleProviderFactory
