'use strict';

/**
 * Encapsulates the instantiation of an EyesScreenshot object.
 *
 * @interface
 */
class EyesScreenshotFactory {
  /**
   * @param {MutableImage} image
   * @return {Promise<EyesScreenshot>}
   */
  async makeScreenshot(image) {
    throw new Error('The method should be implemented!');
  }
}

exports.EyesScreenshotFactory = EyesScreenshotFactory;
