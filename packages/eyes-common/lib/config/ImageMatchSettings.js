'use strict';

const { ArgumentGuard } = require('../utils/ArgumentGuard');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { TypeUtils } = require('../utils/TypeUtils');
const { MatchLevel } = require('./MatchLevel');
const { AccessibilityLevel } = require('./AccessibilityLevel');
const { ExactMatchSettings } = require('./ExactMatchSettings');

const DEFAULT_VALUES = {
  matchLevel: MatchLevel.Strict,
  accessibilityLevel: AccessibilityLevel.None,
  ignoreCaret: true,
  useDom: false,
  enablePatterns: false,
  ignoreDisplacements: false,
};

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
   * @param {boolean} [ignoreDisplacements]
   * @param {Region[]} [ignore]
   * @param {Region[]} [layout]
   * @param {Region[]} [strict]
   * @param {Region[]} [content]
   * @param {AccessibilityMatchSettings[]} [accessibility]
   * @param {FloatingMatchSettings[]} [floating]
   * @param {AccessibilityLevel} [accessibilityLevel]
   */
  constructor({ matchLevel, exact, ignoreCaret, useDom, enablePatterns, ignoreDisplacements, ignore, layout, strict, content, accessibility, floating, accessibilityLevel } = {}) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!');
    }

    ArgumentGuard.isValidEnumValue(matchLevel, MatchLevel, false);
    ArgumentGuard.isValidEnumValue(accessibilityLevel, AccessibilityLevel, false);
    ArgumentGuard.isBoolean(ignoreCaret, 'ignoreCaret', false);
    ArgumentGuard.isBoolean(useDom, 'useDom', false);
    ArgumentGuard.isBoolean(enablePatterns, 'enablePatterns', false);
    ArgumentGuard.isBoolean(ignoreDisplacements, 'ignoreDisplacements', false);
    ArgumentGuard.isArray(ignore, 'ignore', false);
    ArgumentGuard.isArray(layout, 'layout', false);
    ArgumentGuard.isArray(strict, 'strict', false);
    ArgumentGuard.isArray(content, 'content', false);
    ArgumentGuard.isArray(accessibility, 'accessibility', false);
    ArgumentGuard.isArray(floating, 'floating', false);
    ArgumentGuard.isValidType(exact, ExactMatchSettings, false);

    this._matchLevel = TypeUtils.getOrDefault(matchLevel, DEFAULT_VALUES.matchLevel);
    this._accessibilityLevel = TypeUtils.getOrDefault(accessibilityLevel, DEFAULT_VALUES.accessibilityLevel);
    this._ignoreCaret = TypeUtils.getOrDefault(ignoreCaret, DEFAULT_VALUES.ignoreCaret);
    this._useDom = TypeUtils.getOrDefault(useDom, DEFAULT_VALUES.useDom);
    this._enablePatterns = TypeUtils.getOrDefault(enablePatterns, DEFAULT_VALUES.enablePatterns);
    this._ignoreDisplacements = TypeUtils.getOrDefault(ignoreDisplacements, DEFAULT_VALUES.ignoreDisplacements);
    this._exact = exact;

    /** @type {Region[]} */
    this._ignoreRegions = ignore || [];
    /** @type {Region[]} */
    this._layoutRegions = layout || [];
    /** @type {Region[]} */
    this._strictRegions = strict || [];
    /** @type {Region[]} */
    this._contentRegions = content || [];
    /** @type {AccessibilityMatchSettings[]} */
    this._accessibilityMatchSettings = accessibility || [];
    /** @type {FloatingMatchSettings[]} */
    this._floatingMatchSettings = floating || [];
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
   * @return {AccessibilityLevel} - The accessablity level to use.
   */
  getAccessibilityValidation() {
    return this._accessibilityLevel;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {AccessibilityLevel} value - The accessablity level to use.
   */
  setAccessibilityValidation(value) {
    ArgumentGuard.isValidEnumValue(value, AccessibilityLevel);
    this._accessibilityLevel = value;
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
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  setIgnoreDisplacements(value) {
    this._ignoreDisplacements = value;
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
   * Sets an array of accessibility regions.
   * @param {AccessibilityMatchSettings[]} accessibilityMatchSettings - The array of accessibility regions.
   */
  setAccessibilityRegions(accessibilityMatchSettings) {
    this._accessibilityMatchSettings = accessibilityMatchSettings;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Returns an array of accessibility regions.
   * @return {AccessibilityMatchSettings[]} - an array of accessibility regions.
   */
  getAccessibilityRegions() {
    return this._accessibilityMatchSettings;
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
      accessibilityMatchSettings: 'accessibility',
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
