;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy'),
    EyesSDK = require('@applitools/eyes-sdk-core-legacy'),
    EyesWebDriverScreenshot = require('./capture/EyesWebDriverScreenshot').EyesWebDriverScreenshot
  var RegionProvider = EyesSDK.RegionProvider,
    GeometryUtils = EyesUtils.GeometryUtils

  /**
   * @param {Logger} logger
   * @param driver
   * @param {{left: number, top: number, width: number, height: number}} region
   * @param {CoordinatesType} coordinatesType
   * @augments RegionProvider
   * @constructor
   */
  function EyesRegionProvider(logger, driver, region, coordinatesType) {
    this._logger = logger
    this._driver = driver
    this._region = region || GeometryUtils.createRegion(0, 0, 0, 0)
    this._coordinatesType = coordinatesType || null
  }

  EyesRegionProvider.prototype = new RegionProvider()
  EyesRegionProvider.prototype.constructor = EyesRegionProvider

  /**
   * @return {{left: number, top: number, width: number, height: number}} A region with "as is" viewport coordinates.
   */
  EyesRegionProvider.prototype.getRegion = function() {
    return this._region
  }

  /**
   * @param {MutableImage} image
   * @param {CoordinatesType} toCoordinatesType
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{left: number, top: number, width: number, height: number}>} A region in selected viewport coordinates.
   */
  EyesRegionProvider.prototype.getRegionInLocation = function(
    image,
    toCoordinatesType,
    promiseFactory,
  ) {
    var that = this
    return promiseFactory.makePromise(function(resolve) {
      if (that._coordinatesType === toCoordinatesType) {
        resolve(that._region)
        return
      }

      var ewds = new EyesWebDriverScreenshot(that._logger, that._driver, image, promiseFactory)
      return ewds.buildScreenshot().then(function() {
        var newRegion = ewds.convertRegionLocation(
          that._region,
          that._coordinatesType,
          toCoordinatesType,
        )
        resolve(newRegion)
      })
    })
  }

  /**
   * @return {CoordinatesType} The type of coordinates on which the region is based.
   */
  EyesRegionProvider.prototype.getCoordinatesType = function() {
    return this._coordinatesType
  }

  exports.EyesRegionProvider = EyesRegionProvider
})()
