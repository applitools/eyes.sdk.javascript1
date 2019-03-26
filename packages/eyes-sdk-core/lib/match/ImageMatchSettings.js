'use strict';

const { ArgumentGuard, GeneralUtils } = require('@applitools/eyes-common');

const { MatchLevel } = require('./MatchLevel');

/**
 * Encapsulates match settings for the a session.
 */
class ImageMatchSettings {
  /**
   * @param {MatchLevel} [matchLevel=MatchLevel.Strict] The "strictness" level to use.
   * @param {ExactMatchSettings} [exact] - Additional threshold parameters when the {@code Exact} match level is used.
   * @param {boolean} [ignoreCaret]
   * @param {boolean} [useDom]
   * @param {boolean} [enablePatterns]
   */
  constructor({ matchLevel, exact, ignoreCaret, useDom, enablePatterns } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }

    this._matchLevel = matchLevel || MatchLevel.Strict;
    this._exact = exact;
    this._ignoreCaret = ignoreCaret;
    this._useDom = useDom;
    this._enablePatterns = enablePatterns;

    /** @type {Region[]} */
    this._ignoreRegions = [];
    /** @type {Region[]} */
    this._layoutRegions = [];
    /** @type {Region[]} */
    this._strictRegions = [];
    /** @type {Region[]} */
    this._contentRegions = [];
    /** @type {FloatingMatchSettings[]} */
    this._floatingMatchSettings = [];
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {MatchLevel} - The match level to use.
   */
  getMatchLevel() {
    return this._matchLevel;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {MatchLevel} value - The match level to use.
   */
  setMatchLevel(value) {
    ArgumentGuard.isValidEnumValue(value, MatchLevel);
    this._matchLevel = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {ExactMatchSettings} - The additional threshold params when the {@code Exact} match level is used, if any.
   */
  getExact() {
    return this._exact;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {ExactMatchSettings} value - The additional threshold parameters when the {@code Exact} match level is used.
   */
  setExact(value) {
    this._exact = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} - The parameters for the "IgnoreCaret" match settings.
   */
  getIgnoreCaret() {
    return this._ignoreCaret;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value - The parameters for the "ignoreCaret" match settings.
   */
  setIgnoreCaret(value) {
    this._ignoreCaret = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setUseDom(value) {
    this._useDom = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getEnablePatterns() {
    return this._enablePatterns;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setEnablePatterns(value) {
    this._enablePatterns = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns the array of regions to ignore.
   * @return {Region[]} - the array of regions to ignore.
   */
  getIgnoreRegions() {
    return this._ignoreRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets an array of regions to ignore.
   * @param {Region[]} ignoreRegions - The array of regions to ignore.
   */
  setIgnoreRegions(ignoreRegions) {
    this._ignoreRegions = ignoreRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets an array of regions to check using the Layout method.
   * @param {Region[]} layoutRegions - The array of regions to ignore.
   */
  setLayoutRegions(layoutRegions) {
    this._layoutRegions = layoutRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns the array of regions to check using the Layout method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getLayoutRegions() {
    return this._layoutRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns the array of regions to check using the Strict method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getStrictRegions() {
    return this._strictRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets an array of regions to check using the Strict method.
   * @param {Region[]} strictRegions - The array of regions to ignore.
   */
  setStrictRegions(strictRegions) {
    this._strictRegions = strictRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns the array of regions to check using the Content method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getContentRegions() {
    return this._contentRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets an array of regions to check using the Content method.
   * @param {Region[]} contentRegions - The array of regions to ignore.
   */
  setContentRegions(contentRegions) {
    this._contentRegions = contentRegions;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns an array of floating regions.
   * @return {FloatingMatchSettings[]} - an array of floating regions.
   */
  getFloatingRegions() {
    return this._floatingMatchSettings;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Sets an array of floating regions.
   * @param {FloatingMatchSettings[]} floatingMatchSettings - The array of floating regions.
   */
  setFloatingRegions(floatingMatchSettings) {
    this._floatingMatchSettings = floatingMatchSettings;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this, [], {
      ignoreRegions: 'ignore',
      layoutRegions: 'layout',
      strictRegions: 'strict',
      contentRegions: 'content',
      floatingMatchSettings: 'floating',
    });
  }

  /**
   * @override
   */
  toString() {
    return `ImageMatchSettings { ${JSON.stringify(this)} }`;
  }
}

exports.ImageMatchSettings = ImageMatchSettings;
