'use strict'
const GeneralUtils = require('../utils/GeneralUtils')

/**
 * Encapsulates the information for the validation about to execute.
 */
class ValidationInfo {
  /**
   * @param {number} [validationId]
   * @param {string} [tag]
   */
  constructor(validationId, tag) {
    this._validationId = validationId
    this._tag = tag
  }

  /**
   * @param {number} value
   */
  setValidationId(value) {
    this._validationId = value
  }

  /**
   * @return {number}
   */
  getValidationId() {
    return this._validationId
  }

  /**
   * @param {string} value
   */
  setTag(value) {
    this._tag = value
  }

  /**
   * @return {string}
   */
  getTag() {
    return this._tag
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }
}

module.exports = ValidationInfo
