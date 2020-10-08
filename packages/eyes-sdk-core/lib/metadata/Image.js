'use strict'

const {GeneralUtils, RectangleSize} = require('../..')

class Image {
  /**
   * @param data
   * @param {string} data.id
   * @param {RectangleSize|object} data.size
   * @param {boolean} data.hasDom
   */
  constructor({id, size, hasDom} = {}) {
    if (size && !(size instanceof RectangleSize)) {
      size = new RectangleSize(size)
    }

    this._id = id
    this._size = size
    // this._rectangle = size;
    // this._location = size;
    this._hasDom = hasDom
  }

  /**
   * @return {string}
   */
  getId() {
    return this._id
  }

  /**
   * @param {string} value
   */
  setId(value) {
    this._id = value
  }

  /**
   * @return {RectangleSize}
   */
  getSize() {
    return this._size
  }

  /**
   * @param {RectangleSize} value
   */
  setSize(value) {
    this._size = value
  }

  /**
   * @return {boolean}
   */
  getHasDom() {
    return this._hasDom
  }

  /**
   * @param {boolean} value
   */
  setHasDom(value) {
    this._hasDom = value
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
    return `Image { ${JSON.stringify(this)} }`
  }
}

module.exports = Image
