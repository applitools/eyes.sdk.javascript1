'use strict'

const {GeneralUtils, DateTimeUtils} = require('../..')

const ImageMatchSettings = require('./ImageMatchSettings')
const Image = require('./Image')

class ActualAppOutput {
  /**
   * @param output
   * @param {Image|object} output.image
   * @param {Image|object} output.thumbprint
   * @param {ImageMatchSettings|object} output.imageMatchSettings
   * @param {boolean} output.ignoreExpectedOutputSettings
   * @param {boolean} output.isMatching
   * @param {boolean} output.areImagesMatching
   * @param {Date|string} output.occurredAt
   * @param {object[]} output.userInputs
   * @param {string} output.windowTitle
   * @param {string} output.tag
   * @param {boolean} output.isPrimary
   */
  constructor({
    image,
    thumbprint,
    imageMatchSettings,
    ignoreExpectedOutputSettings,
    isMatching,
    areImagesMatching,
    occurredAt,
    userInputs,
    windowTitle,
    tag,
    isPrimary,
  } = {}) {
    if (image && !(image instanceof Image)) {
      image = new Image(image)
    }

    if (thumbprint && !(thumbprint instanceof Image)) {
      thumbprint = new Image(thumbprint)
    }

    if (imageMatchSettings && !(imageMatchSettings instanceof ImageMatchSettings)) {
      imageMatchSettings = new ImageMatchSettings(imageMatchSettings)
    }

    if (occurredAt && !(occurredAt instanceof Date)) {
      occurredAt = DateTimeUtils.fromISO8601DateTime(occurredAt)
    }

    this._image = image
    this._thumbprint = thumbprint
    this._imageMatchSettings = imageMatchSettings
    this._ignoreExpectedOutputSettings = ignoreExpectedOutputSettings
    this._isMatching = isMatching
    this._areImagesMatching = areImagesMatching
    this._occurredAt = occurredAt
    this._userInputs = userInputs
    this._windowTitle = windowTitle
    this._tag = tag
    this._isPrimary = isPrimary
  }

  /**
   * @return {Image}
   */
  getImage() {
    return this._image
  }

  /**
   * @param {Image} value
   */
  setImage(value) {
    this._image = value
  }

  /**
   * @return {Image}
   */
  getThumbprint() {
    return this._thumbprint
  }

  /**
   * @param {Image} value
   */
  setThumbprint(value) {
    this._thumbprint = value
  }

  /**
   * @return {ImageMatchSettings}
   */
  getImageMatchSettings() {
    return this._imageMatchSettings
  }

  /**
   * @param {ImageMatchSettings} value
   */
  setImageMatchSettings(value) {
    this._imageMatchSettings = value
  }

  /**
   * @return {boolean}
   */
  getIgnoreExpectedOutputSettings() {
    return this._ignoreExpectedOutputSettings
  }

  /**
   * @param {boolean} value
   */
  setIgnoreExpectedOutputSettings(value) {
    this._ignoreExpectedOutputSettings = value
  }

  /**
   * @return {boolean}
   */
  getIsMatching() {
    return this._isMatching
  }

  /**
   * @param {boolean} value
   */
  setIsMatching(value) {
    this._isMatching = value
  }

  /**
   * @return {boolean}
   */
  getAreImagesMatching() {
    return this._areImagesMatching
  }

  /**
   * @param {boolean} value
   */
  setAreImagesMatching(value) {
    this._areImagesMatching = value
  }

  /**
   * @return {Date}
   */
  getOccurredAt() {
    return this._occurredAt
  }

  /**
   * @param {Date} value
   */
  setOccurredAt(value) {
    this._occurredAt = value
  }

  /**
   * @return {object[]}
   */
  getUserInputs() {
    return this._userInputs
  }

  /**
   * @param {object[]} value
   */
  setUserInputs(value) {
    this._userInputs = value
  }

  /**
   * @return {string}
   */
  getWindowTitle() {
    return this._windowTitle
  }

  /**
   * @param {string} value
   */
  setWindowTitle(value) {
    this._windowTitle = value
  }

  /**
   * @return {string}
   */
  getTag() {
    return this._tag
  }

  /**
   * @param {string} value
   */
  setTag(value) {
    this._tag = value
  }

  /**
   * @return {boolean}
   */
  getIsPrimary() {
    return this._isPrimary
  }

  /**
   * @param {boolean} value
   */
  setIsPrimary(value) {
    this._isPrimary = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }

  /**
   * @override
   */
  toString() {
    return `ActualAppOutput { ${JSON.stringify(this)} }`
  }
}

module.exports = ActualAppOutput
