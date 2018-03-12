'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * @typedef {{x: number, y: number}} LocationObject
 */

/**
 * A location in a two-dimensional plane.
 */
class Location {

    /**
     * Creates a Location instance.
     *
     * The constructor accept next attributes:
     * - (x: number, y: number): from `x` and `y` values
     * - (location: Location): from another instance of Location
     * - (object: {x: number, y: number}): from object
     *
     * @param {Number|Location|LocationObject} arg1 The X coordinate of this location.
     * @param {Number} [arg2] The Y coordinate of the location.
     */
    constructor(arg1, arg2) {
        let x = arg1, y = arg2;

        if (arg1 instanceof Object) {
            if (arg1 instanceof Location) {
                return Location.fromLocation(arg1);
            }

            return Location.fromObject(arg1);
        }

        ArgumentGuard.isInteger(x, "x");
        ArgumentGuard.isInteger(y, "y");

        this._x = x;
        this._y = y;
    }

    /**
     * Creates a new instance of Location from other Location
     *
     * @param {Location} other
     * @return {Location}
     */
    static fromLocation(other) {
        ArgumentGuard.isValidType(other, Location);

        return new Location(other.getX(), other.getY());
    }

    /**
     * Creates a new instance of Location from object
     *
     * @param {LocationObject} object
     * @return {Location}
     */
    static fromObject(object) {
        ArgumentGuard.isValidType(object, Object);
        ArgumentGuard.hasProperties(object, ['x', 'y'], 'object');

        // noinspection JSSuspiciousNameCombination
        return new Location(Math.ceil(object.x), Math.ceil(object.y));
    }

    /**
     * @return {Number} The X coordinate of this location.
     */
    getX() {
        return this._x;
    }

    /**
     * @return {Number} The Y coordinate of this location.
     */
    getY() {
        return this._y;
    }

    /**
     * Indicates whether some other Location is "equal to" this one.
     *
     * @param {Object|Location} obj The reference object with which to compare.
     * @return {Boolean} {@code true} if this object is the same as the obj argument; {@code false} otherwise.
     */
    equals(obj) {
        if(typeof obj !== typeof this || !(obj instanceof Location)) {
            return false;
        }

        return this.getX() === obj.getX() && this.getY() === obj.getY();
    }

    /**
     * Get a location translated by the specified amount.
     *
     * @param {Number} dx The amount to offset the x-coordinate.
     * @param {Number} dy The amount to offset the y-coordinate.
     * @return {Location} A location translated by the specified amount.
     */
    offset(dx, dy) {
        return new Location(this._x + dx, this._y + dy);
    }

    /**
     * Get a location translated by the specified amount.
     *
     * @param {Location} amount The amount to offset.
     * @return {Location} A location translated by the specified amount.
     */
    offsetByLocation(amount) {
        return this.offset(amount.getX(), amount.getY());
    }

    /**
     * Get a scaled location.
     *
     * @param {Number} scaleRatio The ratio by which to scale the results.
     * @return {Location} A scaled copy of the current location.
     */
    scale(scaleRatio) {
        return new Location(Math.ceil(this._x * scaleRatio), Math.ceil(this._y * scaleRatio));
    }

    /**
     * @return {{x: Number, y: Number}}
     */
    toJSON() {
        return {
            x: this._x,
            y: this._y
        }
    }

    /** @override */
    toString() {
        return `(${this._x}, ${this._y})`;
    }

    toStringForFilename() {
        return `${this._x}_${this._y}`;
    }
}

Location.ZERO = new Location(0, 0);

module.exports = Location;
