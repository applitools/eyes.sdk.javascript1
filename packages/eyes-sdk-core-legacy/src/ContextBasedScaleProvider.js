;(function() {
  'use strict'

  var ArgumentGuard = require('@applitools/eyes-common-legacy').ArgumentGuard
  var ScaleProvider = require('./ScaleProvider').ScaleProvider

  // Allowed deviations for viewport size and default content entire size.
  var ALLOWED_VS_DEVIATION = 1,
    ALLOWED_DCES_DEVIATION = 10,
    UNKNOWN_SCALE_RATIO = 0

  /**
   * @constructor
   * @param {{width: number, height: number}} topLevelContextEntireSize The total size of the top level context.
   *        E.g., for selenium this would be the document size of the top level frame.
   * @param {{width: number, height: number}} viewportSize The viewport size.
   * @param {number} devicePixelRatio The device pixel ratio of the platform on which the application is running.
   * @augments ScaleProvider
   */
  function ContextBasedScaleProvider(topLevelContextEntireSize, viewportSize, devicePixelRatio) {
    this._topLevelContextEntireSize = topLevelContextEntireSize
    this._viewportSize = viewportSize
    this._devicePixelRatio = devicePixelRatio

    // Since we need the image size to decide what the scale ratio is.
    this._scaleRatio = UNKNOWN_SCALE_RATIO
  }

  ContextBasedScaleProvider.prototype = new ScaleProvider()
  ContextBasedScaleProvider.prototype.constructor = ContextBasedScaleProvider

  /**
   * @return {number} The ratio by which an image will be scaled.
   */
  ContextBasedScaleProvider.prototype.getScaleRatio = function() {
    ArgumentGuard.isValidState(
      this._scaleRatio !== UNKNOWN_SCALE_RATIO,
      'scaleRatio not defined yet',
    )
    return this._scaleRatio
  }

  /**
   * Set the scale ratio based on the given image.
   * @param {number} imageToScaleWidth The width of the image to scale, used for calculating the scale ratio.
   */
  ContextBasedScaleProvider.prototype.updateScaleRatio = function(imageToScaleWidth) {
    var viewportWidth = this._viewportSize.width
    var dcesWidth = this._topLevelContextEntireSize.width

    // If the image's width is the same as the viewport's width or the
    // top level context's width, no scaling is necessary.
    if (
      (imageToScaleWidth >= viewportWidth - ALLOWED_VS_DEVIATION &&
        imageToScaleWidth <= viewportWidth + ALLOWED_VS_DEVIATION) ||
      (imageToScaleWidth >= dcesWidth - ALLOWED_DCES_DEVIATION &&
        imageToScaleWidth <= dcesWidth + ALLOWED_DCES_DEVIATION)
    ) {
      this._scaleRatio = 1
    } else {
      this._scaleRatio = 1 / this._devicePixelRatio
    }
  }

  exports.ContextBasedScaleProvider = ContextBasedScaleProvider
})()
