'use strict';

const { ArgumentGuard } = require('../utils/ArgumentGuard');

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
   * @signature `new Location(location)`
   * @sigparam {Location} location - The Location instance to clone from.
   *
   * @signature `new Location(object)`
   * @sigparam {{x: number, x: number}} object - The location object to clone from.
   *
   * @signature `new Location(x, y)`
   * @sigparam {number} x - The X coordinate of this location.
   * @sigparam {number} y - The Y coordinate of this location.
   *
   * @param {Location|LocationObject|number} varArg1 - The Location (or object) to clone from or the X coordinate of new Location.
   * @param {number} [varArg2] - The Y coordinate of new Location.
   */
  constructor(varArg1, varArg2) {
    if (arguments.length === 2) {
      return new Location({ x: varArg1, y: varArg2 });
    }

    if (varArg1 instanceof Location) {
      return new Location({ x: varArg1.getX(), y: varArg1.getY() });
    }

    const { x, y } = varArg1;
    ArgumentGuard.isNumber(x, 'x');
    ArgumentGuard.isNumber(y, 'y');

    // TODO: remove call to Math.ceil
    this._x = Math.ceil(x);
    this._y = Math.ceil(y);
  }

  /**
   * @return {number} - The X coordinate of this location.
   */
  getX() {
    return this._x;
  }

  /**
   * @return {number} - The Y coordinate of this location.
   */
  getY() {
    return this._y;
  }

  /**
   * Indicates whether some other Location is "equal to" this one.
   *
   * @param {object|Location} obj - The reference object with which to compare.
   * @return {boolean} - A {@code true} if this object is the same as the obj argument, {@code false} otherwise.
   */
  equals(obj) {
    if (typeof obj !== typeof this || !(obj instanceof Location)) {
      return false;
    }

    return this.getX() === obj.getX() && this.getY() === obj.getY();
  }

  /**
   * Get a location translated by the specified amount.
   *
   * @param {number} dx - The amount to offset the x-coordinate.
   * @param {number} dy - The amount to offset the y-coordinate.
   * @return {Location} - A location translated by the specified amount.
   */
  offset(dx, dy) {
    return new Location({ x: this._x + dx, y: this._y + dy });
  }

  /**
   *
   * @param {Location} other
   * @return {Location}
   */
  offsetNegative(other) {
    return new Location({ x: this._x - other.getX(), y: this._y - other.getY() });
  }

  /**
   * Get a location translated by the specified amount.
   *
   * @param {Location} amount - The amount to offset.
   * @return {Location} - A location translated by the specified amount.
   */
  offsetByLocation(amount) {
    return this.offset(amount.getX(), amount.getY());
  }

  /**
   * Get a scaled location.
   *
   * @param {number} scaleRatio - The ratio by which to scale the results.
   * @return {Location} - A scaled copy of the current location.
   */
  scale(scaleRatio) {
    return new Location({ x: Math.ceil(this._x * scaleRatio), y: Math.ceil(this._y * scaleRatio) });
  }

  /**
   * @override
   */
  toJSON() {
    return { x: this._x, y: this._y };
  }

  /**
   * @override
   */
  toString() {
    return `(${this._x}, ${this._y})`;
  }

  toStringForFilename() {
    return `${this._x}_${this._y}`;
  }
}

Location.ZERO = new Location({ x: 0, y: 0 });

exports.Location = Location;
