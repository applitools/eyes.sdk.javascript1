;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy')
  var ArgumentGuard = EyesUtils.ArgumentGuard,
    GeneralUtils = EyesUtils.GeneralUtils,
    GeometryUtils = EyesUtils.GeometryUtils

  /**
   * @constructor
   * @param {MutableImage} image
   **/
  function EyesScreenshot(image) {
    this._image = image
  }

  /**
   * @return {MutableImage} the screenshot image.
   */
  EyesScreenshot.prototype.getImage = function() {
    return this._image
  }

  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @param {{left: number, top: number, width: number, height: number}} region The region for which we should get the sub screenshot.
   * @param {CoordinatesType} coordinatesType How should the region be calculated on the
   * screenshot image.
   * @param {boolean} throwIfClipped Throw an EyesException if the region is not
   * fully contained in the screenshot.
   * @return {EyesScreenshot} A screenshot instance containing the given region.
   */
  EyesScreenshot.prototype.getSubScreenshot = function(region, coordinatesType, throwIfClipped) {}

  /**
   * Converts a location's coordinates with the {@code from} coordinates type
   * to the {@code to} coordinates type.
   *
   * @param {{x: number, y: number}} location The location which coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code location}.
   * @param {CoordinatesType} to The target coordinates type for {@code location}.
   * @return {{x: number, y: number}} A new location which is the transformation of {@code location} to
   * the {@code to} coordinates type.
   */
  EyesScreenshot.prototype.convertLocationFromLocation = function(location, from, to) {}

  /**
   * Calculates the location in the screenshot of the location given as
   * parameter.
   *
   * @param {{x: number, y: number}} location The location as coordinates inside the current frame.
   * @param {CoordinatesType} coordinatesType The coordinates type of {@code location}.
   * @return {{x: number, y: number}} The corresponding location inside the screenshot,
   * in screenshot as-is coordinates type.
   * @throws com.applitools.eyes.OutOfBoundsException If the location is
   * not inside the frame's region in the screenshot.
   */
  EyesScreenshot.prototype.getLocationInScreenshot = function(location, coordinatesType) {}

  /**
   * Get the intersection of the given region with the screenshot.
   *
   * @param {{left: number, top: number, width: number, height: number}} region The region to intersect.
   * @param {CoordinatesType} originalCoordinatesType The coordinates type of {@code region}.
   * @param {CoordinatesType} resultCoordinatesType The coordinates type of the resulting region.
   * @return {{left: number, top: number, width: number, height: number}} The intersected region, in {@code resultCoordinatesType} coordinates.
   */
  EyesScreenshot.prototype.getIntersectedRegion = function(
    region,
    originalCoordinatesType,
    resultCoordinatesType,
  ) {}

  /**
   * Converts a region's location coordinates with the {@code from}
   * coordinates type to the {@code to} coordinates type.
   *
   * @param {{left: number, top: number, width: number, height: number}} region The region which location's coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code region}.
   * @param {CoordinatesType} to The target coordinates type for {@code region}.
   * @return {{left: number, top: number, width: number, height: number}} A new region which is the transformation of {@code region} to the {@code to} coordinates type.
   */
  EyesScreenshot.prototype.convertRegionLocation = function(region, from, to) {
    ArgumentGuard.notNull(region, 'region')

    if (GeometryUtils.isRegionEmpty(region)) {
      return GeneralUtils.clone(region)
    }

    ArgumentGuard.notNull(from, 'from')
    ArgumentGuard.notNull(to, 'to')

    var updatedLocation = this.convertLocationFromLocation(
      GeometryUtils.createLocationFromRegion(region),
      from,
      to,
    )

    return GeometryUtils.createRegionFromLocationAndSize(
      updatedLocation,
      GeometryUtils.createSizeFromRegion(region),
    )
  }

  exports.EyesScreenshot = EyesScreenshot
})()
