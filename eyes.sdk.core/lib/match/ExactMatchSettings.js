'use strict';

const { GeneralUtils } = require('../utils/GeneralUtils');

/**
 * Encapsulates match settings for the a session.
 */
class ExactMatchSettings {
  /**
   * Encapsulate threshold settings for the "Exact" match level.
   *
   * @param {number} [minDiffIntensity=0] - The minimum intensity difference of pixel to be considered a change. Valid
   *   values are 0-255.
   * @param {number} [minDiffWidth=0] - The minimum width of an intensity filtered pixels cluster to be considered a
   *   change. Must be >= 0.
   * @param {number} [minDiffHeight=0] - The minimum height of an intensity filtered pixels cluster to be considered a
   *   change. Must be >= 0.
   * @param {number} [matchThreshold=0] - The maximum percentage(!) of different pixels (after intensity, width and
   *   height filtering) which is still considered as a match. Valid values are fractions between 0-1.
   */
  constructor(minDiffIntensity, minDiffWidth, minDiffHeight, matchThreshold) {
    this._minDiffIntensity = minDiffIntensity || 0;
    this._minDiffWidth = minDiffWidth || 0;
    this._minDiffHeight = minDiffHeight || 0;
    this._matchThreshold = matchThreshold || 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @protected
   * @return {number} - The minimum intensity difference of pixel to be considered a change.
   */
  getMinDiffIntensity() {
    return this._minDiffIntensity;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
    * @protected
   * @param {number} value - The minimum intensity difference of pixel to be considered a change. Valid values are 0-255.
   */
  setMinDiffIntensity(value) {
    this._minDiffIntensity = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
   */
  getMinDiffWidth() {
    return this._minDiffWidth;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @param {number} value - The minimum width of an intensity filtered pixels cluster to be considered a change.
   *   Must be >= 0.
   */
  setMinDiffWidth(value) {
    this._minDiffWidth = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
   */
  getMinDiffHeight() {
    return this._minDiffHeight;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @param {number} value - The minimum height of an intensity filtered pixels cluster to be considered a change. Must
   *   be >= 0.
   */
  setMinDiffHeight(value) {
    this._minDiffHeight = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @return {number} - The maximum percentage(!) of different pixels (after intensity, width and height filtering) which
   *   is still considered as a match.
   */
  getMatchThreshold() {
    return this._matchThreshold;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
     * @protected
   * @param {number} value - The maximum percentage(!) of different pixels (after intensity, width and height filtering)
   *   which is still considered as a match. Valid values are fractions between 0-1.
   */
  setMatchThreshold(value) {
    this._matchThreshold = value;
  }

  /** 
     * @protected
     * @override 
     */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /** 
     * @protected
     * @override 
     */
  toString() {
    return `ExactMatchSettings { ${JSON.stringify(this)} }`;
  }
}

exports.ExactMatchSettings = ExactMatchSettings;
