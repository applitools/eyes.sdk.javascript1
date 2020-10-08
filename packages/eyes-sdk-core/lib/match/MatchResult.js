'use strict'

const GeneralUtils = require('../utils/GeneralUtils')

/**
 * The result of a window match by the agent.
 */
class MatchResult {
  /**
   * @param {object} result
   * @param {boolean} [result.asExpected]
   * @param {number} [result.windowId]
   */
  constructor({asExpected, windowId} = {}) {
    this._asExpected = asExpected
    this._windowId = windowId
  }

  /**
   * @return {boolean}
   */
  getAsExpected() {
    return this._asExpected
  }

  /**
   * @param {boolean} value
   */
  setAsExpected(value) {
    this._asExpected = value
  }

  /**
   * @return {number}
   */
  getWindowId() {
    return this._windowId
  }

  /**
   * @param {number} value
   */
  setWindowId(value) {
    this._windowId = value
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
    return `MatchResult { ${JSON.stringify(this)} }`
  }
}

module.exports = MatchResult
