'use strict'

/**
 * Encapsulates the information for the validation about to execute.
 */
class ValidationResult {
  /**
   * @param {boolean} [asExpected]
   */
  constructor(asExpected) {
    this._asExpected = asExpected
  }

  /**
   * @param {boolean} value
   */
  setAsExpected(value) {
    this._asExpected = value
  }

  /**
   * @return {boolean}
   */
  getAsExpected() {
    return this._asExpected
  }
}

module.exports = ValidationResult
