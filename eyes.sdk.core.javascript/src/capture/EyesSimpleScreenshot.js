'use strict';

const ArgumentGuard = require('../ArgumentGuard');
const Region = require('../geometry/Region');
const RectangleSize = require('../geometry/RectangleSize');
const Location = require('../geometry/Location');
const CoordinatesType = require('../geometry/CoordinatesType');
const OutOfBoundsError = require('../errors/OutOfBoundsError');
const CoordinatesTypeConversionError = require('../errors/CoordinatesTypeConversionError');
const EyesScreenshot = require('./EyesScreenshot');

/**
 * Encapsulates a screenshot taken by the images SDK.
 */
class EyesSimpleScreenshot extends EyesScreenshot {

    /**
     * @param {MutableImage} image The screenshot image.
     * @param {Location} [location] The top/left coordinates of the screenshot in context relative coordinates type.
     */
    constructor(image, location = new Location(0, 0)) {
        super(image);

        // The screenshot region in coordinates relative to the "entire screen"
        // (e.g., relative to the default content in case of a web page).
        this._bounds = new Region(location, new RectangleSize(image.getWidth(), image.getHeight()));
    }

    /**
     * Get size of screenshot
     *
     * @return {RectangleSize}
     */
    getSize() {
        return this._bounds.getSize();
    }

    /**
     * Get sub screenshot.
     *
     * @param {Region} region The region for which we should get the sub screenshot.
     * @param {Boolean} throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
     * @return {Promise<EyesScreenshot>} Sub screenshot.
     */
    getSubScreenshot(region, throwIfClipped) {
        ArgumentGuard.notNull(region, "region");

        // We want to get the sub-screenshot in as-is coordinates type.
        const subScreenshotRegion = this.getIntersectedRegion(region, CoordinatesType.SCREENSHOT_AS_IS);

        if (subScreenshotRegion.isEmpty() || (throwIfClipped && !subScreenshotRegion.getSize().equals(region.getSize()))) {
            throw new OutOfBoundsError(`Region [${region}] is out of screenshot bounds [${this._bounds}]`);
        }

        const that = this;
        return this._image.getImagePart(subScreenshotRegion).then(subScreenshotImage => {
            // Notice that we need the bounds-relative coordinates as parameter for new sub-screenshot.
            const relativeSubScreenshotRegion = that.convertRegionLocation(subScreenshotRegion, CoordinatesType.SCREENSHOT_AS_IS, CoordinatesType.CONTEXT_RELATIVE);
            return new EyesSimpleScreenshot(subScreenshotImage, relativeSubScreenshotRegion.getLocation());
        });
    }

    /**
     * Convert the location.
     *
     * @param {Location} location The location which coordinates needs to be converted.
     * @param {CoordinatesType} from The current coordinates type for {@code location}.
     * @param {CoordinatesType} to The target coordinates type for {@code location}.
     * @return {Location} The converted location.
     */
    convertLocation(location, from, to) {
        ArgumentGuard.notNull(location, "location");
        ArgumentGuard.notNull(from, "from");
        ArgumentGuard.notNull(to, "to");

        const result = new Location(location);

        if (from === to) {
            return result;
        }

        switch (from) {
            case CoordinatesType.SCREENSHOT_AS_IS:
                if (to === CoordinatesType.CONTEXT_RELATIVE) {
                    result.offset(this._bounds.getLeft(), this._bounds.getTop());
                } else {
                    throw new CoordinatesTypeConversionError(from, to);
                }
                break;

            case CoordinatesType.CONTEXT_RELATIVE:
                if (to === CoordinatesType.SCREENSHOT_AS_IS) {
                    result.offset(-this._bounds.getLeft(), -this._bounds.getTop());
                } else {
                    throw new CoordinatesTypeConversionError(from, to);
                }
                break;

            default:
                throw new CoordinatesTypeConversionError(from, to);
        }
        return result;
    }

    /**
     * Get the location in the screenshot.
     *
     * @param {Location} location The location as coordinates inside the current frame.
     * @param {CoordinatesType} coordinatesType The coordinates type of {@code location}.
     * @return {Location} The location in the screenshot.
     */
    getLocationInScreenshot(location, coordinatesType) {
        ArgumentGuard.notNull(location, "location");
        ArgumentGuard.notNull(coordinatesType, "coordinatesType");

        location = this.convertLocation(location, coordinatesType, CoordinatesType.CONTEXT_RELATIVE);

        if (!this._bounds.contains(location)) {
            throw new OutOfBoundsError(`Location ${location} ('${coordinatesType}') is not visible in screenshot!`);
        }

        return this.convertLocation(location, CoordinatesType.CONTEXT_RELATIVE, CoordinatesType.SCREENSHOT_AS_IS);
    }

    /**
     * Get the intersected region.
     *
     * @param {Region} region The region to intersect.
     * @param {CoordinatesType} resultCoordinatesType The coordinates type of the resulting region.
     * @return {Region} The region of the intersected region.
     */
    getIntersectedRegion(region, resultCoordinatesType) {
        ArgumentGuard.notNull(region, "region");
        ArgumentGuard.notNull(resultCoordinatesType, "coordinatesType");

        if (region.isEmpty()) {
            return new Region(region);
        }

        const intersectedRegion = this.convertRegionLocation(region, region.getCoordinatesType(), CoordinatesType.CONTEXT_RELATIVE);
        intersectedRegion.intersect(this._bounds);

        // If the intersection is empty we don't want to convert the coordinates.
        if (region.isEmpty()) {
            return region;
        }

        // The returned result should be in the coordinatesType given as parameter.
        intersectedRegion.setLocation(this.convertLocation(intersectedRegion.getLocation(), CoordinatesType.CONTEXT_RELATIVE, resultCoordinatesType));

        return intersectedRegion;
    }
}

module.exports = EyesSimpleScreenshot;
