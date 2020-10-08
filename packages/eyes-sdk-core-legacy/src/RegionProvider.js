;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy')
  var GeometryUtils = EyesUtils.GeometryUtils

  /**
   * @param {{left: number, top: number, width: number, height: number}} region
   * @param {CoordinatesType} coordinatesType
   * @constructor
   */
  function RegionProvider(region, coordinatesType) {
    this._region = region || GeometryUtils.createRegion(0, 0, 0, 0)
    this._coordinatesType = coordinatesType || null
  }

  /**
   * @return {{left: number, top: number, width: number, height: number}} A region with "as is" viewport coordinates.
   */
  RegionProvider.prototype.getRegion = function() {
    return this._region
  }

  /**
   * @param {MutableImage} image
   * @param {CoordinatesType} toCoordinatesType
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{left: number, top: number, width: number, height: number}>} A region in selected viewport coordinates.
   */
  RegionProvider.prototype.getRegionInLocation = function(
    image,
    toCoordinatesType,
    promiseFactory,
  ) {}

  /**
   * @return {CoordinatesType} The type of coordinates on which the region is based.
   */
  RegionProvider.prototype.getCoordinatesType = function() {
    return this._coordinatesType
  }

  exports.RegionProvider = RegionProvider
})()
