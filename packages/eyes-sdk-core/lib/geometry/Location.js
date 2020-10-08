'use strict'
const ArgumentGuard = require('../utils/ArgumentGuard')
const TypeUtils = require('../utils/TypeUtils')

/**
 * @typedef {{x: number, y: number}} LocationObject
 */

/**
 * A location in a two-dimensional plane.
 */
class Location {
  /**
   * Creates a Location instance.
   * @param {Location|LocationObject|number} varArg1 - The Location (or object) to clone from or the X coordinate of new Location.
   * @param {number} [varArg2] - The Y coordinate of new Location.
   */
  constructor(varArg1, varArg2) {
    if (arguments.length === 2) {
      return new Location({x: varArg1, y: varArg2})
    }

    if (TypeUtils.instanceOf(varArg1, Location)) {
      return new Location({x: varArg1.getX(), y: varArg1.getY()})
    }

    const {x, y} = varArg1
    ArgumentGuard.isNumber(x, 'x')
    ArgumentGuard.isNumber(y, 'y')

    this._x = x
    this._y = y
  }

  static get __Location() {
    return true
  }

  /**
   * @return {number} The X coordinate of this location.
   */
  getX() {
    return this._x
  }

  /**
   * @return {number} - The Y coordinate of this location.
   */
  getY() {
    return this._y
  }

  /**
   * Indicates whether some other Location is "equal to" this one.
   *
   * @param {Location} obj - The reference object with which to compare.
   * @return {boolean} - A {@code true} if this object is the same as the obj argument, {@code false} otherwise.
   */
  equals(obj) {
    if (typeof obj !== typeof this || !(obj instanceof Location)) {
      return false
    }

    return this.getX() === obj.getX() && this.getY() === obj.getY()
  }

  /**
   * Get a location translated by the specified amount.
   *
   * @param {number} dx - The amount to offset the x-coordinate.
   * @param {number} dy - The amount to offset the y-coordinate.
   * @return {Location} - A location translated by the specified amount.
   */
  offset(dx, dy) {
    return new Location({x: this._x + dx, y: this._y + dy})
  }

  /**
   *
   * @param {Location} other
   * @return {Location}
   */
  offsetNegative(other) {
    return new Location({x: this._x - other.getX(), y: this._y - other.getY()})
  }

  /**
   * Get a location translated by the specified amount.
   *
   * @param {Location} amount - The amount to offset.
   * @return {Location} - A location translated by the specified amount.
   */
  offsetByLocation(amount) {
    return this.offset(amount.getX(), amount.getY())
  }

  /**
   * Get a scaled location.
   *
   * @param {number} scaleRatio - The ratio by which to scale the results.
   * @return {Location} - A scaled copy of the current location.
   */
  scale(scaleRatio) {
    return new Location({x: this._x * scaleRatio, y: this._y * scaleRatio})
  }

  /**
   * @override
   */
  toJSON() {
    return {x: this._x, y: this._y}
  }

  /**
   * @override
   */
  toString() {
    return `(${this._x}, ${this._y})`
  }

  toStringForFilename() {
    return `${this._x}_${this._y}`
  }
}

/** @type {Location} */
Location.ZERO = new Location({x: 0, y: 0})

module.exports = Location
