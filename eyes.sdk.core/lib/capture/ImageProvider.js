'use strict';

/**
 * Encapsulates image retrieval.
 *
 * @interface
 */
class ImageProvider {
  /**
   * @return {Promise<MutableImage>}
   */
  async getImage() {
    throw new Error('The method should be implemented!');
  }
}

exports.ImageProvider = ImageProvider;
