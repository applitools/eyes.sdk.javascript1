'use strict'
/* eslint-disable no-unused-vars */

/**
 * Encapsulates cutting logic.
 * @interface
 */
class CutProvider {
  /**
   * @param {MutableImage} image - The image to cut.
   * @return {Promise<MutableImage>} - A new cut image.
   */
  async cut(image) {
    throw new TypeError('The method is not implemented!')
  }

  /**
   * Get a scaled version of the cut provider.
   *
   * @param {number} scaleRatio - The ratio by which to scale the current cut parameters.
   * @return {CutProvider} - A new scale cut provider instance.
   */
  scale(scaleRatio) {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = CutProvider
