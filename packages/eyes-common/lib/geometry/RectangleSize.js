'use strict';

const { ArgumentGuard } = require('../utils/ArgumentGuard');

/**
 * @typedef {{width: number, height: number}} RectangleSizeObject
 */

/**
 * Represents a 2D size.
 */
class RectangleSize {
  /**
   * Creates a RectangleSize instance.
   *
   * @signature `new RectangleSize(rectangleSize)`
   * @sigparam {RectangleSize} rectangleSize - The RectangleSize instance to clone from.
   *
   * @signature `new RectangleSize(object)`
   * @sigparam {{width: number, height: number}} object - The size object to clone from.
   *
   * @signature `new RectangleSize(width, height)`
   * @sigparam {number} width - The width of the rectangle.
   * @sigparam {number} height - The height of the rectangle.
   *
   * @param {RectangleSize|RectangleSizeObject|number} varArg1 - The RectangleSize (or object) to clone from or the width of new RectangleSize.
   * @param {number} [varArg2] - The height of new RectangleSize.
   */
  constructor(varArg1, varArg2) {
    if (arguments.length === 2) {
      return new RectangleSize({ width: varArg1, height: varArg2 });
    }

    if (varArg1 instanceof RectangleSize) {
      return new RectangleSize({ width: varArg1.getWidth(), height: varArg1.getHeight() });
    }

    const { width, height } = varArg1;
    ArgumentGuard.greaterThanOrEqualToZero(width, 'width', true);
    ArgumentGuard.greaterThanOrEqualToZero(height, 'height', true);

    this._width = width;
    this._height = height;
  }

  /**
   * Parses a string into a {@link RectangleSize} instance.
   *
   * @param {string} size - A string representing width and height separated by "x".
   * @return {RectangleSize} - An instance representing the input size.
   */
  static parse(size) {
    ArgumentGuard.notNull(size, 'size');
    const parts = size.split('x');
    if (parts.length !== 2) {
      throw new Error(`IllegalArgument: Not a valid size string: ${size}`);
    }

    return new RectangleSize({ width: parseInt(parts[0], 10), height: parseInt(parts[1], 10) });
  }

  /**
   * @return {boolean}
   */
  isEmpty() {
    return this.getWidth() === 0 && this.getHeight() === 0;
  }

  /**
   * @return {number} - The rectangle's width.
   */
  getWidth() {
    return this._width;
  }

  /**
   * @return {number} - The rectangle's height.
   */
  getHeight() {
    return this._height;
  }

  /**
   * Indicates whether some other RectangleSize is "equal to" this one.
   *
   * @param {object|RectangleSize} obj - The reference object with which to compare.
   * @return {boolean} - A {@code true} if this object is the same as the obj argument; {@code false} otherwise.
   */
  equals(obj) {
    if (typeof obj !== typeof this || !(obj instanceof RectangleSize)) {
      return false;
    }

    return this.getWidth() === obj.getWidth() && this.getHeight() === obj.getHeight();
  }

  /**
   * Get a scaled version of the current size.
   *
   * @param {number} scaleRatio - The ratio by which to scale the results.
   * @return {RectangleSize} - A scaled copy of the current size.
   */
  scale(scaleRatio) {
    return new RectangleSize({
      width: Math.ceil(this._width * scaleRatio),
      height: Math.ceil(this._height * scaleRatio),
    });
  }

  /**
   * @override
   */
  toJSON() {
    return { width: this._width, height: this._height };
  }

  /**
   * @override
   */
  toString() {
    return `${this._width}x${this._height}`;
  }
}

RectangleSize.EMPTY = new RectangleSize(0, 0);

exports.RectangleSize = RectangleSize;
