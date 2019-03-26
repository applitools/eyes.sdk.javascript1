'use strict';

/* eslint-disable no-unused-vars */

/**
 * Encapsulates the instantiation of an EyesScreenshot object.
 *
 * @ignore
 * @abstract
 */
class EyesScreenshotFactory {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {MutableImage} image
   * @return {Promise<EyesScreenshot>}
   */
  async makeScreenshot(image) {
    throw new TypeError('The method is not implemented!');
  }
}

exports.EyesScreenshotFactory = EyesScreenshotFactory;
