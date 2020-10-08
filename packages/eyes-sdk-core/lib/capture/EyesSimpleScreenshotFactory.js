'use strict'

const EyesScreenshotFactory = require('./EyesScreenshotFactory')
const EyesSimpleScreenshot = require('./EyesSimpleScreenshot')

/**
 * Encapsulates the instantiation of an EyesSimpleScreenshot.
 *
 * @ignore
 */
class EyesSimpleScreenshotFactory extends EyesScreenshotFactory {
  /**
   * @inheritDoc
   * @return {Promise<EyesSimpleScreenshot>}
   */
  async makeScreenshot(image) {
    return new EyesSimpleScreenshot(image)
  }
}

module.exports = EyesSimpleScreenshotFactory
