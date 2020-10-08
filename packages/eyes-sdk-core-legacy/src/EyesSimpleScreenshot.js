;(function() {
  'use strict'

  var EyesUtils = require('@applitools/eyes-common-legacy')
  var ArgumentGuard = EyesUtils.ArgumentGuard,
    GeneralUtils = EyesUtils.GeneralUtils,
    GeometryUtils = EyesUtils.GeometryUtils

  var EyesScreenshot = require('./EyesScreenshot').EyesScreenshot
  var CoordinatesType = require('./CoordinatesType').CoordinatesType

  /**
   * @param {MutableImage} image The actual screenshot image.
   * @param {{x: number, y: number}} [location]
   * @augments EyesScreenshot
   * @constructor
   */
  function EyesSimpleScreenshot(image, location = {x: 0, y: 0}) {
    EyesScreenshot.call(this, image)

    this._bounds = GeometryUtils.createRegionFromLocationAndSize(location, image.getSize())
  }

  EyesSimpleScreenshot.prototype = new EyesScreenshot()
  EyesSimpleScreenshot.prototype.constructor = EyesSimpleScreenshot

  /**
   * Get size of screenshot
   *
   * @return {RectangleSize}
   */
  EyesSimpleScreenshot.prototype.getSize = function() {
    return GeometryUtils.createSizeFromRegion(this._bounds)
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @param {{left: number, top: number, width: number, height: number}} region The region for which we should get the sub screenshot.
   * @param {CoordinatesType} coordinatesType How should the region be calculated on the screenshot image.
   * @param {boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesSimpleScreenshot>} A screenshot instance containing the given region.
   */
  EyesSimpleScreenshot.prototype.getSubScreenshot = function(
    region,
    coordinatesType,
    throwIfClipped,
  ) {
    ArgumentGuard.notNull(region, 'region')
    var that = this

    // We calculate intersection based on as-is coordinates.
    var subScreenshotRegion = this.getIntersectedRegion(
      region,
      coordinatesType,
      CoordinatesType.SCREENSHOT_AS_IS,
    )

    var sizeFromRegion = GeometryUtils.createSizeFromRegion(region)
    var sizeFromSubRegion = GeometryUtils.createSizeFromRegion(subScreenshotRegion)

    if (
      GeometryUtils.isRegionEmpty(subScreenshotRegion) ||
      (throwIfClipped &&
        !(
          sizeFromRegion.height === sizeFromSubRegion.height &&
          sizeFromRegion.width === sizeFromSubRegion.width
        ))
    ) {
      throw new Error(
        'Region ',
        region,
        ', (',
        coordinatesType,
        ') is out of screenshot bounds ',
        this._frameWindow,
      )
    }

    return this._image.cropImage(subScreenshotRegion).then(function(subScreenshotImage) {
      // The frame location in the sub screenshot is the negative of the
      // context-as-is location of the region.
      var relativeSubScreenshotRegion = that.convertRegionLocation(
        subScreenshotRegion,
        CoordinatesType.SCREENSHOT_AS_IS,
        CoordinatesType.CONTEXT_RELATIVE,
      )

      return new EyesSimpleScreenshot(
        subScreenshotImage,
        GeometryUtils.createLocationFromRegion(relativeSubScreenshotRegion),
      )
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * Converts a location's coordinates with the {@code from} coordinates type
   * to the {@code to} coordinates type.
   *
   * @param {{x: number, y: number}} location The location which coordinates needs to be converted.
   * @param {CoordinatesType} from The current coordinates type for {@code location}.
   * @param {CoordinatesType} to The target coordinates type for {@code location}.
   * @return {{x: number, y: number}} A new location which is the transformation of {@code location} to the {@code to} coordinates type.
   */
  EyesSimpleScreenshot.prototype.convertLocationFromLocation = function(location, from, to) {
    ArgumentGuard.notNull(location, 'location')
    ArgumentGuard.notNull(from, 'from')
    ArgumentGuard.notNull(to, 'to')

    var result = {x: location.x, y: location.y}

    if (from === to) {
      return result
    }

    switch (from) {
      case CoordinatesType.SCREENSHOT_AS_IS: {
        if (to === CoordinatesType.CONTEXT_RELATIVE) {
          GeometryUtils.locationOffset(result, {x: this._bounds.left, y: this._bounds.top})
        } else {
          throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
        }
        break
      }
      case CoordinatesType.CONTEXT_RELATIVE: {
        if (to === CoordinatesType.SCREENSHOT_AS_IS) {
          GeometryUtils.locationOffset(result, {x: -this._bounds.left, y: -this._bounds.top})
        } else {
          throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
        }
        break
      }
      default: {
        throw new Error("Cannot convert from '" + from + "' to '" + to + "'")
      }
    }
    return result
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {{x: number, y: number}} location
   * @param {CoordinatesType} coordinatesType
   * @return {{x: number, y: number}}
   */
  EyesSimpleScreenshot.prototype.getLocationInScreenshot = function(location, coordinatesType) {
    ArgumentGuard.notNull(location, 'location')
    ArgumentGuard.notNull(coordinatesType, 'coordinatesType')

    var newLocation = this.convertLocationFromLocation(
      location,
      coordinatesType,
      CoordinatesType.CONTEXT_RELATIVE,
    )

    // Making sure it's within the screenshot bounds
    if (!GeometryUtils.isRegionContainsLocation(this._frameWindow, newLocation)) {
      throw new Error(
        'Location ' + newLocation + " ('" + coordinatesType + "') is not visible in screenshot!",
      )
    }
    return this.convertLocationFromLocation(
      newLocation,
      CoordinatesType.CONTEXT_RELATIVE,
      CoordinatesType.SCREENSHOT_AS_IS,
    )
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {{left: number, top: number, width: number, height: number}} region
   * @param {CoordinatesType} originalCoordinatesType
   * @param {CoordinatesType} resultCoordinatesType
   * @return {{left: number, top: number, width: number, height: number}}
   */
  EyesSimpleScreenshot.prototype.getIntersectedRegion = function(
    region,
    originalCoordinatesType,
    resultCoordinatesType,
  ) {
    ArgumentGuard.notNull(region, 'region')
    ArgumentGuard.notNull(resultCoordinatesType, 'coordinatesType')

    if (GeometryUtils.isRegionEmpty(region)) {
      return GeneralUtils.clone(region)
    }

    var intersectedRegion = this.convertRegionLocation(
      region,
      originalCoordinatesType,
      CoordinatesType.CONTEXT_RELATIVE,
    )
    intersectedRegion = GeometryUtils.intersect(intersectedRegion, this._bounds)

    // If the intersection is empty we don't want to convert the coordinates.
    if (GeometryUtils.isRegionEmpty(intersectedRegion)) {
      return intersectedRegion
    }

    // Converting the result to the required coordinates type.
    var newLocation = this.convertLocationFromLocation(
      GeometryUtils.createLocationFromRegion(intersectedRegion),
      CoordinatesType.CONTEXT_RELATIVE,
      resultCoordinatesType,
    )
    intersectedRegion.left = newLocation.x
    intersectedRegion.top = newLocation.y

    return intersectedRegion
  }

  exports.EyesSimpleScreenshot = EyesSimpleScreenshot
})()
