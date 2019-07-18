'use strict';

const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { TypeUtils } = require('../utils/TypeUtils');
const { RectangleSize } = require('./RectangleSize');
const { Location } = require('./Location');
const { CoordinatesType } = require('./CoordinatesType');

/**
 * @typedef {{left: number, top: number, width: number, height: number, coordinatesType: CoordinatesType|undefined}} RegionObject
 */

// noinspection FunctionWithMultipleLoopsJS
/**
 * @private
 * @param {Region} containerRegion - The region to divide into sub-regions.
 * @param {RectangleSize} subRegionSize - The maximum size of each sub-region.
 * @return {Region[]} - The sub-regions composing the current region. If subRegionSize is equal or greater than
 *   the current region, only a single region is returned.
 */
const getSubRegionsWithFixedSize = (containerRegion, subRegionSize) => {
  ArgumentGuard.notNull(containerRegion, 'containerRegion');
  ArgumentGuard.notNull(subRegionSize, 'subRegionSize');

  const subRegions = [];

  let subRegionWidth = subRegionSize.getWidth();
  let subRegionHeight = subRegionSize.getHeight();

  ArgumentGuard.greaterThanZero(subRegionWidth, 'subRegionSize width');
  ArgumentGuard.greaterThanZero(subRegionHeight, 'subRegionSize height');

  // Normalizing.
  if (subRegionWidth > containerRegion.getWidth()) {
    subRegionWidth = containerRegion.getWidth();
  }
  if (subRegionHeight > containerRegion.getHeight()) {
    subRegionHeight = containerRegion.getHeight();
  }

  // If the requested size is greater or equal to the entire region size, we return a copy of the region.
  if (subRegionWidth === containerRegion.getWidth() && subRegionHeight === containerRegion.getHeight()) {
    subRegions.push(new Region(containerRegion));
    return subRegions;
  }

  let currentTop = containerRegion.getTop();
  const bottom = (containerRegion.getTop() + containerRegion.getHeight()) - 1;
  const right = (containerRegion.getLeft() + containerRegion.getWidth()) - 1;

  while (currentTop <= bottom) {
    if (currentTop + subRegionHeight > bottom) {
      currentTop = (bottom - subRegionHeight) + 1;
    }

    let currentLeft = containerRegion.getLeft();
    while (currentLeft <= right) {
      if (currentLeft + subRegionWidth > right) {
        currentLeft = (right - subRegionWidth) + 1;
      }

      subRegions.push(new Region(currentLeft, currentTop, subRegionWidth, subRegionHeight));

      currentLeft += subRegionWidth;
    }
    currentTop += subRegionHeight;
  }
  return subRegions;
};

// noinspection FunctionWithMultipleLoopsJS
/**
 * @private
 * @param {Region} containerRegion - The region to divide into sub-regions.
 * @param {RectangleSize} maxSubRegionSize - The maximum size of each sub-region (some regions might be smaller).
 * @return {Region[]} - The sub-regions composing the current region. If maxSubRegionSize is equal or greater than
 *   the current region, only a single region is returned.
 */
const getSubRegionsWithVaryingSize = (containerRegion, maxSubRegionSize) => {
  ArgumentGuard.notNull(containerRegion, 'containerRegion');
  ArgumentGuard.notNull(maxSubRegionSize, 'maxSubRegionSize');
  ArgumentGuard.greaterThanZero(maxSubRegionSize.getWidth(), 'maxSubRegionSize.getWidth()');
  ArgumentGuard.greaterThanZero(maxSubRegionSize.getHeight(), 'maxSubRegionSize.getHeight()');

  const subRegions = [];

  let currentTop = containerRegion.getTop();
  const bottom = containerRegion.getTop() + containerRegion.getHeight();
  const right = containerRegion.getLeft() + containerRegion.getWidth();

  while (currentTop < bottom) {
    let currentBottom = currentTop + maxSubRegionSize.getHeight();
    if (currentBottom > bottom) {
      currentBottom = bottom;
    }

    let currentLeft = containerRegion.getLeft();
    while (currentLeft < right) {
      let currentRight = currentLeft + maxSubRegionSize.getWidth();
      if (currentRight > right) {
        currentRight = right;
      }

      const currentHeight = currentBottom - currentTop;
      const currentWidth = currentRight - currentLeft;

      subRegions.push(new Region(currentLeft, currentTop, currentWidth, currentHeight));
      currentLeft += maxSubRegionSize.getWidth();
    }
    currentTop += maxSubRegionSize.getHeight();
  }
  return subRegions;
};

/**
 * A Region in a two-dimensional plane.
 */
class Region {
  /**
   * Creates a Region instance.
   *
   * @signature `new Region(region)`
   * @sigparam {Region} region - The region instance to clone from.
   *
   * @signature `new Region(object)`
   * @sigparam {{left: number, top: number, width: number, height: number}} object - The region object to clone from.
   *
   * @signature `new Region(location, size)`
   * @sigparam {Location} location - The region location to use.
   * @sigparam {RectangleSize} size - The region size to use.
   *
   * @signature `new Region(left, top, width, height)`
   * @sigparam {number} left - The region left offset.
   * @sigparam {number} top - The region top offset.
   * @sigparam {number} width - The region width.
   * @sigparam {number} height - The region height.
   *
   * @param {Region|RegionObject|Location|number} varArg1 - The Region (or object) to clone from, the Location of new region or the left offset of new region.
   * @param {RectangleSize|number} [varArg2] - The Region size or the top offset of new region.
   * @param {CoordinatesType|number} [varArg3] - The width of new region.
   * @param {number} [varArg4] - The height of new region.
   * @param {CoordinatesType} [varArg5] - The coordinatesType of new region (protected argument).
   */
  constructor(varArg1, varArg2, varArg3, varArg4, varArg5) {
    if (arguments.length === 2 || arguments.length === 3) {
      // eslint-disable-next-line max-len
      return new Region({ left: varArg1.getX(), top: varArg1.getY(), width: varArg2.getWidth(), height: varArg2.getHeight(), coordinatesType: varArg3 });
    }

    if (arguments.length === 4 || arguments.length === 5) {
      // eslint-disable-next-line max-len
      return new Region({ left: varArg1, top: varArg2, width: varArg3, height: varArg4, coordinatesType: varArg5 });
    }

    if (varArg1 instanceof Region) {
      // eslint-disable-next-line max-len
      return new Region({ left: varArg1.getLeft(), top: varArg1.getTop(), width: varArg1.getWidth(), height: varArg1.getHeight(), coordinatesType: varArg1.getCoordinatesType() });
    }

    const { left, top, width, height, coordinatesType, error } = varArg1;

    if (error) {
      this._error = error;
    } else {
      ArgumentGuard.isNumber(left, 'left');
      ArgumentGuard.isNumber(top, 'top');
      ArgumentGuard.greaterThanOrEqualToZero(width, 'width', true);
      ArgumentGuard.greaterThanOrEqualToZero(height, 'height', true);

      // TODO: remove call to Math.ceil
      this._left = Math.ceil(left);
      this._top = Math.ceil(top);
      this._width = width;
      this._height = height;
      this._coordinatesType = coordinatesType || CoordinatesType.SCREENSHOT_AS_IS;
    }
  }

  /**
   * @param {object} object
   * @return {boolean}
   */
  static isRegionCompatible(object) {
    return (object instanceof Region) ||
      (TypeUtils.isPlainObject(object) && TypeUtils.has(object, ['left', 'top', 'width', 'height']));
  }

  /**
   * @return {number} - The region's left offset.
   */
  getLeft() {
    return this._left;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setLeft(value) {
    this._left = value;
  }

  /**
   * @return {number} - The region's top offset.
   */
  getTop() {
    return this._top;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setTop(value) {
    this._top = value;
  }

  /**
   * @return {number} - The region's right offset.
   */
  getRight() {
    return this._left + this._width;
  }

  /**
   * @return {number} - The region's bottom offset.
   */
  getBottom() {
    return this._top + this._height;
  }

  /**
   * @return {number} - The region's width.
   */
  getWidth() {
    return this._width;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setWidth(value) {
    this._width = value;
  }

  /**
   * @return {number} - The region's height.
   */
  getHeight() {
    return this._height;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} value
   */
  setHeight(value) {
    this._height = value;
  }

  /**
   * @return {CoordinatesType} - The region's coordinatesType.
   */
  getCoordinatesType() {
    return this._coordinatesType;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {CoordinatesType} value
   */
  setCoordinatesType(value) {
    this._coordinatesType = value;
  }

  /**
   * @return {string}
   */
  getError() {
    return this._error;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setError(value) {
    this._error = value;
  }

  /**
   * @return {Location} - The (top,left) position of the current region.
   */
  getLocation() {
    return new Location({ x: this._left, y: this._top });
  }

  /**
   * Set the (top,left) position of the current region
   *
   * @param {Location} location - The (top,left) position to set.
   */
  setLocation(location) {
    ArgumentGuard.notNull(location, 'location');
    this._left = location.getX();
    this._top = location.getY();
  }

  /**
   * @return {RectangleSize} - The size of the region.
   */
  getSize() {
    return new RectangleSize({ width: this._width, height: this._height });
  }

  /**
   * Set the (width,height) size of the current region
   *
   * @param {RectangleSize} size - The updated size of the region.
   */
  setSize(size) {
    ArgumentGuard.notNull(size, 'size');
    this._width = size.getWidth();
    this._height = size.getHeight();
  }

  /**
   * Indicates whether some other Region is "equal to" this one.
   *
   * @param {object|Region} obj - The reference object with which to compare.
   * @return {boolean} - A {@code true} if this object is the same as the obj argument; {@code false} otherwise.
   */
  equals(obj) {
    if (typeof obj !== typeof this || !(obj instanceof Region)) {
      return false;
    }

    // noinspection OverlyComplexBooleanExpressionJS
    return (
      this.getLeft() === obj.getLeft() &&
      this.getTop() === obj.getTop() &&
      this.getWidth() === obj.getWidth() &&
      this.getHeight() === obj.getHeight()
    );
  }

  /**
   * @return {boolean} - A {@code true} if the region is empty; {@code false} otherwise.
   */
  isEmpty() {
    // noinspection OverlyComplexBooleanExpressionJS
    return (
      this.getLeft() === Region.EMPTY.getLeft() &&
      this.getTop() === Region.EMPTY.getTop() &&
      this.getWidth() === Region.EMPTY.getWidth() &&
      this.getHeight() === Region.EMPTY.getHeight()
    );
  }

  /**
   * @return {boolean} - A {@code true} if the region's size is 0, false otherwise.
   */
  isSizeEmpty() {
    return this.getWidth() <= 0 || this.getHeight() <= 0;
  }

  /**
   * Get a Region translated by the specified amount.
   *
   * @param {number} dx - The amount to offset the x-coordinate.
   * @param {number} dy - The amount to offset the y-coordinate.
   * @return {Region} - A region with an offset location.
   */
  offset(dx, dy) {
    return new Region(this.getLocation().offset(dx, dy), this.getSize(), this.getCoordinatesType());
  }

  /**
   * @return {Location}
   */
  getMiddleOffset() {
    const middleX = this._width / 2;
    const middleY = this._height / 2;

    return new Location({ x: middleX, y: middleY });
  }

  /**
   * Get a region which is a scaled version of the current region.
   * IMPORTANT: This also scales the LOCATION(!!) of the region (not just its size).
   *
   * @param {number} scaleRatio - The ratio by which to scale the results.
   * @return {Region} - A new region which is a scaled version of the current region.
   */
  scale(scaleRatio) {
    return new Region(
      this.getLocation().scale(scaleRatio),
      this.getSize().scale(scaleRatio),
      this.getCoordinatesType()
    );
  }

  /**
   * Returns a list of sub-regions which compose the current region.
   *
   * @param {RectangleSize} subRegionSize - The default sub-region size to use.
   * @param {boolean} [isFixedSize=false] - If {@code false}, then sub-regions might have a size which is smaller then
   *   {@code subRegionSize} (thus there will be no overlap of regions). Otherwise, all sub-regions will have the same
   *   size, but sub-regions might overlap.
   * @return {Region[]} - The sub-regions composing the current region. If {@code subRegionSize} is equal or
   *   greater than the current region, only a single region is returned.
   */
  getSubRegions(subRegionSize, isFixedSize = false) {
    if (isFixedSize) {
      return getSubRegionsWithFixedSize(this, subRegionSize);
    }

    return getSubRegionsWithVaryingSize(this, subRegionSize);
  }

  /**
   * Check if a specified region is contained within the another region or location.
   *
   * @param {Region|Location} locationOrRegion - The region or location to check if it is contained within the current
   *   region.
   * @return {boolean} - True if the region is contained within given object, false otherwise.
   */
  contains(locationOrRegion) {
    if (locationOrRegion instanceof Location) {
      // noinspection OverlyComplexBooleanExpressionJS
      return (
        locationOrRegion.getX() >= this._left &&
        locationOrRegion.getX() <= this._left + this._width &&
        locationOrRegion.getY() >= this._top &&
        locationOrRegion.getY() <= this._top + this._height
      );
    }

    if (locationOrRegion instanceof Region) {
      // noinspection OverlyComplexBooleanExpressionJS
      return (
        this._top <= locationOrRegion.getTop() &&
        this._left <= locationOrRegion.getLeft() &&
        this._top + this._height >= locationOrRegion.getTop() + locationOrRegion.getHeight() &&
        this._left + this._width >= locationOrRegion.getLeft() + locationOrRegion.getWidth()
      );
    }

    throw new TypeError('Unsupported type of given object.');
  }

  /**
   * Check if a region is intersected with the current region.
   *
   * @param {Region} other - The region to check intersection with.
   * @return {boolean} - True if the regions are intersected, false otherwise.
   */
  isIntersected(other) {
    const right = this._left + this._width;
    const bottom = this._top + this._height;

    const otherLeft = other.getLeft();
    const otherTop = other.getTop();
    const otherRight = otherLeft + other.getWidth();
    const otherBottom = otherTop + other.getHeight();

    // noinspection OverlyComplexBooleanExpressionJS
    return (
      ((this._left <= otherLeft && otherLeft <= right) || (otherLeft <= this._left && this._left <= otherRight)) &&
      ((this._top <= otherTop && otherTop <= bottom) || (otherTop <= this._top && this._top <= otherBottom))
    );
  }

  /**
   * Replaces this region with the intersection of itself and {@code other}
   *
   * @param {Region} other - The region with which to intersect.
   */
  intersect(other) {
    if (!this.isIntersected(other)) {
      this.makeEmpty();
      return;
    }

    // The regions intersect. So let's first find the left & top values
    const otherLeft = other.getLeft();
    const otherTop = other.getTop();

    const intersectionLeft = this._left >= otherLeft ? this._left : otherLeft;
    const intersectionTop = this._top >= otherTop ? this._top : otherTop;

    // Now the width and height of the intersect
    const right = this._left + this._width;
    const otherRight = otherLeft + other.getWidth();
    const intersectionRight = right <= otherRight ? right : otherRight;
    const intersectionWidth = intersectionRight - intersectionLeft;

    const bottom = this._top + this._height;
    const otherBottom = otherTop + other.getHeight();
    const intersectionBottom = bottom <= otherBottom ? bottom : otherBottom;
    const intersectionHeight = intersectionBottom - intersectionTop;

    this._left = intersectionLeft;
    this._top = intersectionTop;
    this._width = intersectionWidth;
    this._height = intersectionHeight;
  }

  /**
   * @protected
   */
  makeEmpty() {
    this._left = Region.EMPTY.getLeft();
    this._top = Region.EMPTY.getTop();
    this._width = Region.EMPTY.getWidth();
    this._height = Region.EMPTY.getHeight();
    this._coordinatesType = Region.EMPTY.getCoordinatesType();
  }

  /**
   * @override
   */
  toJSON() {
    if (this._error) {
      return {
        error: this._error,
      };
    }

    return {
      left: this._left,
      top: this._top,
      width: this._width,
      height: this._height,
      coordinatesType: this._coordinatesType,
    };
  }

  /**
   * @override
   */
  toString() {
    if (this._error) {
      return `Error: ${this._error}`;
    }

    return `(${this._left}, ${this._top}) ${this._width}x${this._height}, ${this._coordinatesType}`;
  }
}

Region.EMPTY = new Region(0, 0, 0, 0);

exports.Region = Region;
