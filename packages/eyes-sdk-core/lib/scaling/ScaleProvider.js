'use strict'

/**
 * Encapsulates scaling logic.
 *
 * @abstract
 */
class ScaleProvider {
  /**
   * @return {number} - The ratio by which an image will be scaled.
   */
  getScaleRatio() {}
}

module.exports = ScaleProvider
