'use strict'

/**
 * An application output (title, image, etc).
 *
 * @ignore
 */
class AppOutput {
  /**
   * @param {object} output
   * @param {string} output.title - The title of the screen of the application being captured.
   * @param {Buffer} [output.screenshot] - Base64 encoding of the screenshot's bytes (the byte can be in either in compressed
   *   or uncompressed form)
   * @param {string} [output.screenshotUrl] - The URL that points to the screenshot
   * @param {string} [output.domUrl] - URL that points to a dom capture of the provided screenshot
   * @param {Location} [output.imageLocation] - Location of the provided screenshot relative to the logical full-page
   *   screenshot (e.g. in checkRegion)
   */
  constructor({title, screenshot, screenshotUrl, domUrl, imageLocation} = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    this._title = title
    this._screenshot64 = screenshot
    this._screenshotUrl = screenshotUrl
    this._domUrl = domUrl
    this._imageLocation = imageLocation
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this._title
  }

  /**
   * @param {string} value
   */
  setTitle(value) {
    this._title = value
  }

  /**
   * @return {Buffer}
   */
  getScreenshot64() {
    return this._screenshot64
  }

  /**
   * @param {Buffer} value
   */
  setScreenshot64(value) {
    this._screenshot64 = value
  }

  /**
   * @return {string}
   */
  getScreenshotUrl() {
    return this._screenshotUrl
  }

  /**
   * @param {string} value
   */
  setScreenshotUrl(value) {
    this._screenshotUrl = value
  }

  /**
   * @return {string}
   */
  getDomUrl() {
    return this._domUrl
  }

  /**
   * @param {string} value
   */
  setDomUrl(value) {
    this._domUrl = value
  }

  /**
   * @return {Location}
   */
  getImageLocation() {
    return this._imageLocation
  }

  /**
   * @param {Location} value
   */
  setImageLocation(value) {
    this._imageLocation = value
  }

  /**
   * @override
   */
  toJSON() {
    const object = {
      title: this._title,
    }

    if (this._screenshot64) {
      object.screenshot64 = this._screenshot64
    }

    if (this._screenshotUrl) {
      object.screenshotUrl = this._screenshotUrl
    }

    if (this._domUrl) {
      object.domUrl = this._domUrl
    }

    if (this._imageLocation) {
      object.location = this._imageLocation.toJSON()
    }

    return object
  }

  /**
   * @override
   */
  toString() {
    const object = this.toJSON()

    if (object.screenshot64) {
      object.screenshot64 = 'REMOVED_FROM_OUTPUT'
    }

    return `AppOutput { ${object} }`
  }
}

module.exports = AppOutput
