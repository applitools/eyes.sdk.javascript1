'use strict';

const ArgumentGuard = require('../ArgumentGuard');
const RectangleSize = require('./RectangleSize');
const Location = require('./Location');
const CoordinatesType = require('./CoordinatesType');

/**
 * @typedef {{left: number, top: number, width: number, height: number, coordinatesType?: CoordinatesType}} RegionObject
 */

let logger = null;

/**
 * A Region in a two-dimensional plane.
 */
class Region {

    /**
     * Creates a Region instance.
     *
     * The constructor accept next attributes:
     * - (left: number, top: number, width: number, height: number, coordinatesType: CoordinatesType): from `left`, `top`, `width`, `height` and `coordinatesType` values
     * - (region: Region): from another instance of Region
     * - (object: {left: number, top: number, width: number, height: number}): from object
     * - (location: Location, size: RectangleSize, coordinatesType: CoordinatesType): from location and size
     *
     * @param {Number|Region|Location|RegionObject} arg1 The left offset of this region.
     * @param {Number|RectangleSize} [arg2] The top offset of this region.
     * @param {Number|CoordinatesType} [arg3] The width of the region.
     * @param {Number} [arg4] The height of the region.
     * @param {CoordinatesType} [arg5=SCREENSHOT_AS_IS] The coordinatesType of the region.
     */
    constructor(arg1, arg2, arg3, arg4, arg5) {
        let left = arg1, top = arg2, width = arg3, height = arg4, coordinatesType = arg5;

        if (arg1 instanceof Object) {
            if (arg1 instanceof Region) {
                return Region.fromRegion(arg1);
            }

            if (arg1 instanceof Location || arg2 instanceof RectangleSize) {
                return Region.fromLocationAndSize(arg1, arg2, arg3);
            }

            return Region.fromObject(arg1);
        }

        ArgumentGuard.isInteger(left, "left");
        ArgumentGuard.isInteger(top, "top");
        ArgumentGuard.greaterThanOrEqualToZero(width, "width", true);
        ArgumentGuard.greaterThanOrEqualToZero(height, "height", true);

        this._left = left;
        this._top = top;
        this._width = width;
        this._height = height;
        this._coordinatesType = coordinatesType || CoordinatesType.SCREENSHOT_AS_IS;
    }

    /**
     * Creates a new instance of Region from Location and Size
     *
     * @param {Location} location A Location instance from which to create the Region
     * @param {RectangleSize} size A RectangleSize instance from which to create the Region
     * @param {CoordinatesType} [coordinatesType=SCREENSHOT_AS_IS] The coordinatesType of the region
     * @return {Region}
     */
    static fromLocationAndSize(location, size, coordinatesType = CoordinatesType.SCREENSHOT_AS_IS) {
        ArgumentGuard.isValidType(location, Location);
        ArgumentGuard.isValidType(size, RectangleSize);

        return new Region(location.getX(), location.getY(), size.getWidth(), size.getHeight(), coordinatesType);
    }

    /**
     * Creates a new instance of Region from other Region
     *
     * @param {Region} other
     * @return {Region}
     */
    static fromRegion(other) {
        ArgumentGuard.isValidType(other, Region);

        return new Region(other.getLeft(), other.getTop(), other.getWidth(), other.getHeight(), other.getCoordinatesType());
    }

    /**
     * Creates a new instance of Region from object
     *
     * @param {RegionObject} object
     * @return {Region}
     */
    static fromObject(object) {
        ArgumentGuard.isValidType(object, Object);
        ArgumentGuard.hasProperties(object, ['left', 'top', 'width', 'height'], 'object');

        // noinspection JSSuspiciousNameCombination
        return new Region(Math.ceil(object.left), Math.ceil(object.top), object.width, object.height, object.coordinatesType);
    }

    /**
     * @param {Logger} newLogger
     */
    static initLogger(newLogger){
        logger = newLogger;
    }

    /**
     * @return {Number} The region's left offset.
     */
    getLeft() {
        return this._left;
    }

    /**
     * @return {Number} The region's top offset.
     */
    getTop() {
        return this._top;
    }

    /**
     * @return {Number} The region's width.
     */
    getWidth() {
        return this._width;
    }

    /**
     * @return {Number} The region's height.
     */
    getHeight() {
        return this._height;
    }

    /**
     * @return {CoordinatesType} The region's coordinatesType.
     */
    getCoordinatesType() {
        return this._coordinatesType;
    }

    /**
     * @return {Location} The (top,left) position of the current region.
     */
    getLocation() {
        return new Location(this._left, this._top);
    }

    /**
     * Set the (top,left) position of the current region
     *
     * @param {Location} location The (top,left) position to set.
     */
    setLocation(location) {
        ArgumentGuard.notNull(location, "location");
        this._left = location.getX();
        this._top = location.getY();
    }

    /**
     * @return {RectangleSize} The size of the region.
     */
    getSize() {
        return new RectangleSize(this._width, this._height);
    }

    /**
     * Set the (width,height) size of the current region
     *
     * @param {RectangleSize} size The updated size of the region.
     */
    setSize(size) {
        ArgumentGuard.notNull(size, "size");
        this._width = size.getWidth();
        this._height = size.getHeight();
    }

    /**
     * Indicates whether some other Region is "equal to" this one.
     *
     * @param {Object|Region} obj The reference object with which to compare.
     * @return {Boolean} {@code true} if this object is the same as the obj argument; {@code false} otherwise.
     */
    equals(obj) {
        if(typeof obj !== typeof this || !(obj instanceof Region)) {
            return false;
        }

        // noinspection OverlyComplexBooleanExpressionJS
        return this.getLeft() === obj.getLeft() &&
            this.getTop() === obj.getTop() &&
            this.getWidth() === obj.getWidth() &&
            this.getHeight() === obj.getHeight();
    }

    /**
     * @return {Boolean} {@code true} if the region is empty; {@code false} otherwise.
     */
    isEmpty() {
        // noinspection OverlyComplexBooleanExpressionJS
        return this.getLeft() === Region.EMPTY.getLeft() &&
            this.getTop() === Region.EMPTY .getTop() &&
            this.getWidth() === Region.EMPTY.getWidth() &&
            this.getHeight() === Region.EMPTY.getHeight();
    }

    /**
     * Get a Region translated by the specified amount.
     *
     * @param {Number} dx The amount to offset the x-coordinate.
     * @param {Number} dy The amount to offset the y-coordinate.
     * @return {Region} A region with an offset location.
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

        return new Location(middleX, middleY);
    }

    /**
     * Get a region which is a scaled version of the current region.
     * IMPORTANT: This also scales the LOCATION(!!) of the region (not just its size).
     *
     * @param {Number} scaleRatio The ratio by which to scale the results.
     * @return {Region} A new region which is a scaled version of the current region.
     */
    scale(scaleRatio) {
        return new Region(this.getLocation().scale(scaleRatio), this.getSize().scale(scaleRatio), this.getCoordinatesType());
    }

    /**
     * Returns a list of sub-regions which compose the current region.
     *
     * @param {RectangleSize} subRegionSize The default sub-region size to use.
     * @param {Boolean} [isFixedSize=false] If {@code false}, then sub-regions might have a size which is smaller then {@code subRegionSize}
     *                      (thus there will be no overlap of regions). Otherwise, all sub-regions will have the same size,
     *                      but sub-regions might overlap.
     * @return {Array.<Region>} The sub-regions composing the current region. If {@code subRegionSize} is equal or greater
     *                      than the current region, only a single region is returned.
     */
    getSubRegions(subRegionSize, isFixedSize = false) {
        if (isFixedSize) {
            return _getSubRegionsWithFixedSize(this, subRegionSize);
        }

        return _getSubRegionsWithVaryingSize(this, subRegionSize);
    }

    /**
     * Check if a specified region is contained within the another region or location.
     *
     * @param {Region|Location} locationOrRegion The region or location to check if it is contained within the current region.
     * @return {Boolean} True if the region is contained within given object, false otherwise.
     */
    contains(locationOrRegion) {
        if (locationOrRegion instanceof Location) {
            // noinspection OverlyComplexBooleanExpressionJS
            return locationOrRegion.getX() >= this._left &&
                locationOrRegion.getX() <= (this._left + this._width) &&
                locationOrRegion.getY() >= this._top &&
                locationOrRegion.getY() <= (this._top + this._height);
        } else if (locationOrRegion instanceof Region) {
            // noinspection OverlyComplexBooleanExpressionJS
            return this._top <= locationOrRegion.getTop() &&
                this._left <= locationOrRegion.getLeft() &&
                (this._top + this._height) >= (locationOrRegion.getTop() + locationOrRegion.getHeight()) &&
                (this._left + this._width) >= (locationOrRegion.getLeft() + locationOrRegion.getWidth());
        } else {
            throw new TypeError('Unsupported type of given object.');
        }
    }

    /**
     * Check if a region is intersected with the current region.
     *
     * @param {Region} other The region to check intersection with.
     * @return {Boolean} True if the regions are intersected, false otherwise.
     */
    isIntersected(other) {
        const right = this._left + this._width;
        const bottom = this._top + this._height;

        const otherLeft = other.getLeft();
        const otherTop = other.getTop();
        const otherRight = otherLeft + other.getWidth();
        const otherBottom = otherTop + other.getHeight();

        // noinspection OverlyComplexBooleanExpressionJS
        return (((this._left <= otherLeft && otherLeft <= right) || (otherLeft <= this._left && this._left <= otherRight)) &&
            ((this._top <= otherTop && otherTop <= bottom) || (otherTop <= this._top && this._top <= otherBottom)));
    }

    /**
     * Replaces this region with the intersection of itself and {@code other}
     *
     * @param {Region} other The region with which to intersect.
     */
    intersect(other) {
        if (logger) {
            logger.verbose(`intersecting this region (${this}) with ${other} ...`);
        }

        if (!this.isIntersected(other)) {
            this.makeEmpty();
            return;
        }

        // The regions intersect. So let's first find the left & top values
        const otherLeft = other.getLeft();
        const otherTop = other.getTop();

        const intersectionLeft = (this._left >= otherLeft) ? this._left : otherLeft;
        const intersectionTop = (this._top >= otherTop) ? this._top : otherTop;

        // Now the width and height of the intersect
        const right = this._left + this._width;
        const otherRight = otherLeft + other.getWidth();
        const intersectionRight = (right <= otherRight) ? right : otherRight;
        const intersectionWidth = intersectionRight - intersectionLeft;

        const bottom = this._top + this._height;
        const otherBottom = otherTop + other.getHeight();
        const intersectionBottom = (bottom <= otherBottom) ? bottom : otherBottom;
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

    toJSON() {
        return {
            left: this._left,
            top: this._top,
            width: this._width,
            height: this._height,
        };
    }

    /** @override */
    toString() {
        return `(${this._left}, ${this._top}) ${this._width}x${this._height}, ${true._coordinatesType}`;
    }
}

// noinspection FunctionWithMultipleLoopsJS
/**
 * @private
 * @param {Region} containerRegion The region to divide into sub-regions.
 * @param {RectangleSize} subRegionSize The maximum size of each sub-region.
 * @return {Array.<Region>} The sub-regions composing the current region. If subRegionSize
 *                          is equal or greater than the current region, only a single region is returned.
 */
function _getSubRegionsWithFixedSize(containerRegion, subRegionSize) {
    ArgumentGuard.notNull(containerRegion, "containerRegion");
    ArgumentGuard.notNull(subRegionSize, "subRegionSize");

    const subRegions = [];

    let subRegionWidth = subRegionSize.getWidth();
    let subRegionHeight = subRegionSize.getHeight();

    ArgumentGuard.greaterThanZero(subRegionWidth, "subRegionSize width");
    ArgumentGuard.greaterThanZero(subRegionHeight, "subRegionSize height");

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
    const bottom = containerRegion.getTop() + containerRegion.getHeight() - 1;
    const right = containerRegion.getLeft() + containerRegion.getWidth() - 1;

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
}

// noinspection FunctionWithMultipleLoopsJS
/**
 * @private
 * @param {Region} containerRegion The region to divide into sub-regions.
 * @param {RectangleSize} maxSubRegionSize The maximum size of each sub-region (some regions might be smaller).
 * @return {Array.<Region>} The sub-regions composing the current region. If maxSubRegionSize is equal or greater
 *                          than the current region, only a single region is returned.
 */
function _getSubRegionsWithVaryingSize(containerRegion, maxSubRegionSize) {
    ArgumentGuard.notNull(containerRegion, "containerRegion");
    ArgumentGuard.notNull(maxSubRegionSize, "maxSubRegionSize");
    ArgumentGuard.greaterThanZero(maxSubRegionSize.getWidth(), "maxSubRegionSize.getWidth()");
    ArgumentGuard.greaterThanZero(maxSubRegionSize.getHeight(), "maxSubRegionSize.getHeight()");

    const subRegions = [];

    let currentTop = containerRegion.getTop();
    const bottom = containerRegion.getTop() + containerRegion.getHeight();
    const right = containerRegion.getLeft() + containerRegion.getWidth();

    while (currentTop < bottom) {

        let currentBottom = currentTop + maxSubRegionSize.getHeight();
        if (currentBottom > bottom) { currentBottom = bottom; }

        let currentLeft = containerRegion.getLeft();
        while (currentLeft < right) {
            let currentRight = currentLeft + maxSubRegionSize.getWidth();
            if (currentRight > right) { currentRight = right; }

            const currentHeight = currentBottom - currentTop;
            const currentWidth = currentRight - currentLeft;

            subRegions.push(new Region(currentLeft, currentTop, currentWidth, currentHeight));
            currentLeft += maxSubRegionSize.getWidth();
        }
        currentTop += maxSubRegionSize.getHeight();
    }
    return subRegions;
}

Region.EMPTY = new Region(0, 0, 0, 0);

module.exports = Region;
