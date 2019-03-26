'use strict';

/**
 * Encapsulates rotation data for images.
 */
class ImageRotation {
  /**
   * @param {number} rotation - The degrees by which to rotate.
   */
  constructor(rotation) {
    this._rotation = rotation;
  }

  /**
   * @return {number} - The degrees by which to rotate.
   */
  getRotation() {
    return this._rotation;
  }
}

exports.ImageRotation = ImageRotation;
