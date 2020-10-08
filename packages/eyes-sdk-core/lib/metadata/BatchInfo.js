'use strict'

const {GeneralUtils, DateTimeUtils} = require('../..')

class BatchInfo {
  /**
   * @param info
   * @param {string} info.id
   * @param {string} info.name
   * @param {Date|string} info.startedAt
   */
  constructor({id, name, startedAt} = {}) {
    if (startedAt && !(startedAt instanceof Date)) {
      startedAt = DateTimeUtils.fromISO8601DateTime(startedAt)
    }

    this._id = id
    this._name = name
    this._startedAt = startedAt
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
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * @param {string} value
   */
  setName(value) {
    this._name = value
  }

  /**
   * @return {Date}
   */
  getStartedAt() {
    return this._startedAt
  }

  /**
   * @param {Date} value
   */
  setStartedAt(value) {
    this._startedAt = value
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
    return `BatchInfo { ${JSON.stringify(this)} }`
  }
}

module.exports = BatchInfo
