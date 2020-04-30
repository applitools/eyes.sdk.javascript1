'use strict'

const EyesScreenshot = require('./EyesScreenshotNew')

/**
 * Encapsulates the instantiation of an {@link EyesScreenshot}
 */
class EyesScreenshotFactory {
  constructor(logger, eyes) {
    this._logger = logger
    this._eyes = eyes
  }

  async makeScreenshot(image) {
    return EyesScreenshot.fromScreenshotType(this._logger, this._eyes, image)
  }
}

module.exports = EyesScreenshotFactory
