'use strict';

/* eslint-disable no-unused-vars */

const { ArgumentGuard, Region } = require('@applitools/eyes-common');

/**
 * Base class for handling screenshots.
 *
 * @abstract
 */
class EyesScreenshot {
  /**
   * @param {MutableImage} image
   */
  constructor(image) {
    ArgumentGuard.notNull(image, 'image');
    this._image = image;
  }

  /**
   * @return {MutableImage} - the screenshot image.
   */
  getImage() {
    return this._image;
  }

  // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
  /**
   * Returns a part of the screenshot based on the given region.
   *
   * @abstract
   * @param {Region} region - The region for which we should get the sub screenshot.
   * @param {boolean} throwIfClipped - Throw an EyesException if the region is not fully contained in the screenshot.
   * @return {Promise<EyesScreenshot>} - A screenshot instance containing the given region.
   */
  getSubScreenshot(region, throwIfClipped) {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
  /**
   * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
   *
   * @abstract
   * @param {Location} location - The location which coordinates needs to be converted.
   * @param {CoordinatesType} from - The current coordinates type for {@code location}.
   * @param {CoordinatesType} to - The target coordinates type for {@code location}.
   * @return {Location} - A new location which is the transformation of {@code location} to the {@code to} type.
   */
  convertLocation(location, from, to) {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
  /**
   * Calculates the location in the screenshot of the location given as parameter.
   *
   * @abstract
   * @param {Location} location - The location as coordinates inside the current frame.
   * @param {CoordinatesType} coordinatesType - The coordinates type of {@code location}.
   * @return {Location} - The corresponding location inside the screenshot, in screenshot as-is coordinates type.
   * @throws OutOfBoundsError If the location is not inside the frame's region in the screenshot.
   */
  getLocationInScreenshot(location, coordinatesType) {
    throw new TypeError('The method is not implemented!');
  }

  // noinspection JSUnusedLocalSymbols, JSMethodCanBeStatic
  /**
   * Get the intersection of the given region with the screenshot.
   * @abstract
   * @param {Region} region - The region to intersect.
   * @param {CoordinatesType} coordinatesType - The coordinates type of {@code region}.
   * @return {Region} - The intersected region, in {@code resultCoordinatesType} coordinates.
   */
  getIntersectedRegion(region, coordinatesType) {
    throw new TypeError('The method is not implemented!');
  }

  /**
   * Converts a region's location coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
   *
   * @param {Region} region - The region which location's coordinates needs to be converted.
   * @param {CoordinatesType} from - The current coordinates type for {@code region}.
   * @param {CoordinatesType} to - The target coordinates type for {@code region}.
   * @return {Region} - A new region which is the transformation of {@code region} to the {@code to} coordinates type.
   */
  convertRegionLocation(region, from, to) {
    ArgumentGuard.notNull(region, 'region');

    if (region.isSizeEmpty()) {
      return new Region(region);
    }

    ArgumentGuard.notNull(from, 'from');
    ArgumentGuard.notNull(to, 'to');

    const updatedLocation = this.convertLocation(region.getLocation(), from, to);

    return new Region(updatedLocation, region.getSize());
  }
}

exports.EyesScreenshot = EyesScreenshot;
