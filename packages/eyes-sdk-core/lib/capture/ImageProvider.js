'use strict'

/**
 * Encapsulates image retrieval.
 *
 * @abstract
 */
class ImageProvider {
  /**
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    throw new TypeError('The method is not implemented!')
  }
}

module.exports = ImageProvider
