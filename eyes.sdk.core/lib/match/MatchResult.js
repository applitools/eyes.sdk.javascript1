'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');

/**
 * The result of a window match by the agent.
 */
class MatchResult {
  constructor() {
    this._asExpected = undefined;
    this._windowId = undefined;
  }

  /**
   * @private
   * @param {object} object
   * @return {MatchResult}
   */
  static fromObject(object) {
    return GeneralUtils.assignTo(new MatchResult(), object);
  }

  /** 
   * @return {boolean} 
   */
  getAsExpected() {
    return this._asExpected;
  }

  /** 
  * @private
  * @param {boolean} value
  */
  setAsExpected(value) {
    this._asExpected = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
  * @return {number} 
  */
  getWindowId() {
    return this._windowId;
  }

  // noinspection JSUnusedGlobalSymbols
  /** 
  * @private
  * @param {number} value 
  */
  setWindowId(value) {
    this._windowId = value;
  }

  /** 
  * @private
  * @override 
  */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** 
  * @private
  * @override
  * @return {string}
  */
  toString() {
    return `MatchResult { ${JSON.stringify(this)} }`;
  }
}

exports.MatchResult = MatchResult;
