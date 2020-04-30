;(function() {
  'use strict'

  var ScaleProvider = require('./ScaleProvider').ScaleProvider,
    ArgumentGuard = require('@applitools/eyes-common-legacy').ArgumentGuard

  /**
   * @constructor
   * @param {number} scaleRatio The scale ratio to use.
   * @augments ScaleProvider
   */
  function FixedScaleProvider(scaleRatio) {
    ArgumentGuard.greaterThanZero(scaleRatio, 'scaleRatio')

    this._scaleRatio = scaleRatio
  }

  FixedScaleProvider.prototype = new ScaleProvider()
  FixedScaleProvider.prototype.constructor = FixedScaleProvider

  /**
   * @return {number} The ratio by which an image will be scaled.
   */
  FixedScaleProvider.prototype.getScaleRatio = function() {
    return this._scaleRatio
  }

  exports.FixedScaleProvider = FixedScaleProvider
})()
