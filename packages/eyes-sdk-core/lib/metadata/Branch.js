'use strict'

const {GeneralUtils} = require('../..')

class Branch {
  /**
   * @param data
   * @param {string} data.id
   * @param {string} data.name
   * @param {boolean} data.isDeleted
   * @param {object} data.updateInfo - TODO: add typed `updateInfo`
   */
  constructor({id, name, isDeleted, updateInfo} = {}) {
    this._id = id
    this._name = name
    this._isDeleted = isDeleted
    this._updateInfo = updateInfo
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
   * @return {boolean}
   */
  getIsDeleted() {
    return this._isDeleted
  }

  /**
   * @param {boolean} value
   */
  setIsDeleted(value) {
    this._isDeleted = value
  }

  /**
   * @return {object}
   */
  getUpdateInfo() {
    return this._updateInfo
  }

  /**
   * @param {object} value
   */
  setUpdateInfo(value) {
    this._updateInfo = value
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
    return `Branch { ${JSON.stringify(this)} }`
  }
}

module.exports = Branch
