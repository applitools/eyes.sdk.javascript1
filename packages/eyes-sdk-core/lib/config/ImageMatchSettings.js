'use strict'

const ArgumentGuard = require('../utils/ArgumentGuard')
const GeneralUtils = require('../utils/GeneralUtils')
const TypeUtils = require('../utils/TypeUtils')
const MatchLevel = require('./MatchLevel')
const AccessibilityLevel = require('./AccessibilityLevel')
const AccessibilityGuidelinesVersions = require('./AccessibilityGuidelinesVersion')
const ExactMatchSettings = require('./ExactMatchSettings')

const DEFAULT_VALUES = {
  matchLevel: MatchLevel.Strict,
  ignoreCaret: true,
  useDom: false,
  enablePatterns: false,
  ignoreDisplacements: false,
}

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
   * @param {AccessibilitySettings} [accessibilitySettings]
   */
  constructor(imageMatchSettings) {
    if (arguments.length > 1) {
      throw new TypeError('Please, use object as a parameter to the constructor!')
    }

    if (arguments[0] && arguments[0].constructor.name === 'ImageMatchSettings') {
      return new ImageMatchSettings(arguments[0]._toPlain())
    }

    const {
      matchLevel,
      exact,
      ignoreCaret,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      ignore,
      layout,
      strict,
      content,
      accessibility,
      floating,
      accessibilitySettings,
    } = imageMatchSettings || {}

    ArgumentGuard.isValidEnumValue(matchLevel, MatchLevel, false)
    ArgumentGuard.isBoolean(ignoreCaret, 'ignoreCaret', false)
    ArgumentGuard.isBoolean(useDom, 'useDom', false)
    ArgumentGuard.isBoolean(enablePatterns, 'enablePatterns', false)
    ArgumentGuard.isBoolean(ignoreDisplacements, 'ignoreDisplacements', false)
    ArgumentGuard.isArray(ignore, 'ignore', false)
    ArgumentGuard.isArray(layout, 'layout', false)
    ArgumentGuard.isArray(strict, 'strict', false)
    ArgumentGuard.isArray(content, 'content', false)
    ArgumentGuard.isArray(accessibility, 'accessibility', false)
    ArgumentGuard.isArray(floating, 'floating', false)
    ArgumentGuard.isValidType(exact, ExactMatchSettings, false)

    this._matchLevel = TypeUtils.getOrDefault(matchLevel, DEFAULT_VALUES.matchLevel)
    this._ignoreCaret = TypeUtils.getOrDefault(ignoreCaret, DEFAULT_VALUES.ignoreCaret)
    this._useDom = TypeUtils.getOrDefault(useDom, DEFAULT_VALUES.useDom)
    this._enablePatterns = TypeUtils.getOrDefault(enablePatterns, DEFAULT_VALUES.enablePatterns)
    this._ignoreDisplacements = TypeUtils.getOrDefault(
      ignoreDisplacements,
      DEFAULT_VALUES.ignoreDisplacements,
    )
    this._exact = exact

    /** @type {Region[]} */
    this._ignoreRegions = ignore || []
    /** @type {Region[]} */
    this._layoutRegions = layout || []
    /** @type {Region[]} */
    this._strictRegions = strict || []
    /** @type {Region[]} */
    this._contentRegions = content || []
    /** @type {AccessibilityMatchSettings[]} */
    this._accessibilityMatchSettings = accessibility || []
    /** @type {AccessibilitySettings} */
    this.setAccessibilitySettings(accessibilitySettings)
    /** @type {FloatingMatchSettings[]} */
    this._floatingMatchSettings = floating || []
  }

  /**
   * @return {MatchLevel} - The match level to use.
   */
  getMatchLevel() {
    return this._matchLevel
  }

  /**
   * @param {MatchLevel} value - The match level to use.
   */
  setMatchLevel(value) {
    ArgumentGuard.isValidEnumValue(value, MatchLevel)
    this._matchLevel = value
  }

  /**
   * @return {AccessibilitySettings} - The accessibility settings to use.
   */
  getAccessibilitySettings() {
    return this._accessibilitySettings
  }

  /**
   * @param {AccessibilitySettings} value - The accessibility settings to use.
   */
  setAccessibilitySettings(value) {
    if (value) {
      ArgumentGuard.hasProperties(value, ['level', 'guidelinesVersion'], 'accessibilitySettings')
      ArgumentGuard.isValidEnumValue(value.level, AccessibilityLevel)
      ArgumentGuard.isValidEnumValue(value.guidelinesVersion, AccessibilityGuidelinesVersions)
    }
    this._accessibilitySettings = value
  }

  /**
   * @return {ExactMatchSettings} - The additional threshold params when the {@code Exact} match level is used, if any.
   */
  getExact() {
    return this._exact
  }

  /**
   * @param {ExactMatchSettings} value - The additional threshold parameters when the {@code Exact} match level is used.
   */
  setExact(value) {
    this._exact = value
  }

  /**
   * @return {boolean} - The parameters for the "IgnoreCaret" match settings.
   */
  getIgnoreCaret() {
    return this._ignoreCaret
  }

  /**
   * @param {boolean} value - The parameters for the "ignoreCaret" match settings.
   */
  setIgnoreCaret(value) {
    this._ignoreCaret = value
  }

  /**
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom
  }

  /**
   * @param {boolean} value
   */
  setUseDom(value) {
    this._useDom = value
  }

  /**
   * @return {boolean}
   */
  getEnablePatterns() {
    return this._enablePatterns
  }

  /**
   * @param {boolean} value
   */
  setEnablePatterns(value) {
    this._enablePatterns = value
  }

  /**
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements
  }

  /**
   * @param {boolean} value
   */
  setIgnoreDisplacements(value) {
    this._ignoreDisplacements = value
  }

  /**
   * Returns the array of regions to ignore.
   * @return {Region[]} - the array of regions to ignore.
   */
  getIgnoreRegions() {
    return this._ignoreRegions
  }

  /**
   * Sets an array of regions to ignore.
   * @param {Region[]} ignoreRegions - The array of regions to ignore.
   */
  setIgnoreRegions(ignoreRegions) {
    this._ignoreRegions = ignoreRegions
  }

  /**
   * Sets an array of regions to check using the Layout method.
   * @param {Region[]} layoutRegions - The array of regions to ignore.
   */
  setLayoutRegions(layoutRegions) {
    this._layoutRegions = layoutRegions
  }

  /**
   * Returns the array of regions to check using the Layout method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getLayoutRegions() {
    return this._layoutRegions
  }

  /**
   * Returns the array of regions to check using the Strict method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getStrictRegions() {
    return this._strictRegions
  }

  /**
   * Sets an array of regions to check using the Strict method.
   * @param {Region[]} strictRegions - The array of regions to ignore.
   */
  setStrictRegions(strictRegions) {
    this._strictRegions = strictRegions
  }

  /**
   * Returns the array of regions to check using the Content method.
   * @return {Region[]} - the array of regions to ignore.
   */
  getContentRegions() {
    return this._contentRegions
  }

  /**
   * Sets an array of regions to check using the Content method.
   * @param {Region[]} contentRegions - The array of regions to ignore.
   */
  setContentRegions(contentRegions) {
    this._contentRegions = contentRegions
  }

  /**
   * Returns an array of floating regions.
   * @return {FloatingMatchSettings[]} - an array of floating regions.
   */
  getFloatingRegions() {
    return this._floatingMatchSettings
  }

  /**
   * Sets an array of accessibility regions.
   * @param {AccessibilityMatchSettings[]} accessibilityMatchSettings - The array of accessibility regions.
   */
  setAccessibilityRegions(accessibilityMatchSettings) {
    this._accessibilityMatchSettings = accessibilityMatchSettings
  }

  /**
   * Returns an array of accessibility regions.
   * @return {AccessibilityMatchSettings[]} - an array of accessibility regions.
   */
  getAccessibilityRegions() {
    return this._accessibilityMatchSettings
  }

  /**
   * Sets an array of floating regions.
   * @param {FloatingMatchSettings[]} floatingMatchSettings - The array of floating regions.
   */
  setFloatingRegions(floatingMatchSettings) {
    this._floatingMatchSettings = floatingMatchSettings
  }

  /**
   * @override
   */
  toJSON() {
    const obj = this._toPlain()
    if (obj.accessibilitySettings) {
      obj.accessibilitySettings = {
        level: obj.accessibilitySettings.level,
        version: obj.accessibilitySettings.guidelinesVersion,
      }
    }
    return obj
  }

  _toPlain() {
    return GeneralUtils.toPlain(this, [], {
      ignoreRegions: 'ignore',
      layoutRegions: 'layout',
      strictRegions: 'strict',
      contentRegions: 'content',
      floatingMatchSettings: 'floating',
      accessibilityMatchSettings: 'accessibility',
    })
  }

  /**
   * @override
   */
  toString() {
    return `ImageMatchSettings { ${JSON.stringify(this)} }`
  }
}

module.exports = ImageMatchSettings
