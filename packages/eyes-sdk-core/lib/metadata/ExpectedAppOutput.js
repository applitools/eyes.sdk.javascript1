'use strict'

const {GeneralUtils, DateTimeUtils} = require('../..')

const Annotations = require('./Annotations')
const Image = require('./Image')

class ExpectedAppOutput {
  /**
   * @param output
   * @param {string} output.tag
   * @param {Image|object} output.image
   * @param {Image|object} output.thumbprint
   * @param {Date|string} output.occurredAt
   * @param {Annotations|object} output.annotations
   */
  constructor({tag, image, thumbprint, occurredAt, annotations} = {}) {
    if (image && !(image instanceof Image)) {
      image = new Image(image)
    }

    if (thumbprint && !(thumbprint instanceof Image)) {
      thumbprint = new Image(thumbprint)
    }

    if (annotations && !(annotations instanceof Annotations)) {
      annotations = new Annotations(annotations)
    }

    if (occurredAt && !(occurredAt instanceof Date)) {
      occurredAt = DateTimeUtils.fromISO8601DateTime(occurredAt)
    }

    this._tag = tag
    this._image = image
    this._thumbprint = thumbprint
    this._occurredAt = occurredAt
    this._annotations = annotations
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
   * @return {Annotations}
   */
  getAnnotations() {
    return this._annotations
  }

  /**
   * @param {Annotations} value
   */
  setAnnotations(value) {
    this._annotations = value
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
    return `ExpectedAppOutput { ${JSON.stringify(this)} }`
  }
}

module.exports = ExpectedAppOutput
