'use strict'

/**
 * Encapsulates rotation data for images.
 */
class ImageRotation {
  /**
   * @param {int} rotation The degrees by which to rotate.
   */
  constructor(rotation) {
    this._rotation = rotation
  }

  /**
   * @return {int} The degrees by which to rotate.
   */
  getRotation() {
    return this._rotation
  }
}

module.exports = ImageRotation
