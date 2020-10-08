'use strict'

const ScaleProviderFactory = require('./ScaleProviderFactory')
const ContextBasedScaleProvider = require('./ContextBasedScaleProvider')

/**
 * Factory implementation for creating {@link ContextBasedScaleProvider} instances.
 *
 * @ignore
 */
class ContextBasedScaleProviderFactory extends ScaleProviderFactory {
  /**
   * @param {Logger} logger
   * @param {RectangleSize} topLevelContextEntireSize - The total size of the top level context. E.g., for selenium this
   *   would be the document size of the top level frame.
   * @param {RectangleSize} viewportSize - The viewport size.
   * @param {number} devicePixelRatio - The device pixel ratio of the platform on which the application is running.
   * @param {boolean} isMobileDevice
   * @param {PropertyHandler} scaleProviderHandler
   */
  constructor(
    logger,
    topLevelContextEntireSize,
    viewportSize,
    devicePixelRatio,
    isMobileDevice,
    scaleProviderHandler,
  ) {
    super(scaleProviderHandler)

    this._logger = logger
    this._topLevelContextEntireSize = topLevelContextEntireSize
    this._viewportSize = viewportSize
    this._devicePixelRatio = devicePixelRatio
    this._isMobileDevice = isMobileDevice
  }

  /**
   * The implementation of getting/creating the scale provider, should be implemented by child classes.
   *
   * @inheritDoc
   * @param {number} imageToScaleWidth - The width of the image to scale. This parameter CAN be by class implementing the
   *   factory, but this is not mandatory.
   * @return {ScaleProvider} - The scale provider to be used.
   */
  getScaleProviderImpl(imageToScaleWidth) {
    const scaleProvider = new ContextBasedScaleProvider(
      this._logger,
      this._topLevelContextEntireSize,
      this._viewportSize,
      this._devicePixelRatio,
      this._isMobileDevice,
    )
    scaleProvider.updateScaleRatio(imageToScaleWidth)
    return scaleProvider
  }
}

module.exports = ContextBasedScaleProviderFactory
