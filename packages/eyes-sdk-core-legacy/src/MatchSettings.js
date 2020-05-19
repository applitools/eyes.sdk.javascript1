;(function() {
  'use strict'

  /**
   * @readonly
   * @enum {string}
   */
  var MatchLevel = {
    // Images do not necessarily match.
    None: 'None',

    // Images have the same layout (legacy algorithm).
    LegacyLayout: 'Layout1',

    // Images have the same layout.
    Layout: 'Layout2',

    // Images have the same layout.
    Layout2: 'Layout2',

    // Images have the same content.
    Content: 'Content',

    // Images are nearly identical.
    Strict: 'Strict',

    // Images are identical.
    Exact: 'Exact',
  }

  /**
   * Encapsulate threshold settings for the "Exact" match level.
   *
   * @param {number} [minDiffIntensity=0] - The minimum intensity difference of pixel to be considered a change. Valid
   *                                      values are 0-255.
   * @param {number} [minDiffWidth=0] - The minimum width of an intensity filtered pixels cluster to be considered a
   *                                  change. Must be >= 0.
   * @param {number} [minDiffHeight=0] - The minimum height of an intensity filtered pixels cluster to be considered a
   *                                  change. Must be >= 0.
   * @param {number} [matchThreshold=0] - The maximum percentage(!) of different pixels (after intensity, width
   *                                      and height filtering) which is still considered as a match. Valid values
   *                                      are fractions between 0-1.
   * @constructor
   */
  function ExactMatchSettings(minDiffIntensity, minDiffWidth, minDiffHeight, matchThreshold) {
    this._minDiffIntensity = minDiffIntensity || 0
    this._minDiffWidth = minDiffWidth || 0
    this._minDiffHeight = minDiffHeight || 0
    this._matchThreshold = matchThreshold || 0
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} [minDiffIntensity=0] - The minimum intensity difference of pixel to be considered a change. Valid
   *                                      values are 0-255.
   */
  ExactMatchSettings.prototype.setMinDiffIntensity = function(minDiffIntensity) {
    this._minDiffIntensity = minDiffIntensity
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {number} - The minimum intensity difference of pixel to be considered a change.
   */
  ExactMatchSettings.prototype.getMinDiffIntensity = function() {
    return this._minDiffIntensity
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} [minDiffWidth=0] - The minimum width of an intensity filtered pixels cluster to be considered a
   *                                  change. Must be >= 0.
   */
  ExactMatchSettings.prototype.setMinDiffWidth = function(minDiffWidth) {
    this._minDiffWidth = minDiffWidth
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
   */
  ExactMatchSettings.prototype.getMinDiffWidth = function() {
    return this._minDiffWidth
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} [minDiffHeight=0] - The minimum height of an intensity filtered pixels cluster to be considered a
   *                                  change. Must be >= 0.
   */
  ExactMatchSettings.prototype.setMinDiffHeight = function(minDiffHeight) {
    this._minDiffHeight = minDiffHeight
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
   */
  ExactMatchSettings.prototype.getMinDiffHeight = function() {
    return this._minDiffHeight
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} [matchThreshold=0] - The maximum percentage(!) of different pixels (after intensity, width
   *                                      and height filtering) which is still considered as a match. Valid values
   *                                      are fractions between 0-1.
   */
  ExactMatchSettings.prototype.setMatchThreshold = function(matchThreshold) {
    this._matchThreshold = matchThreshold
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @return {number} - The maximum percentage(!) of different pixels (after intensity, width and height filtering)
   *                  which is still considered as a match.
   */
  ExactMatchSettings.prototype.getMatchThreshold = function() {
    return this._matchThreshold
  }

  /**
   * Encapsulates the match settings for a session.
   *
   * @param {MatchLevel} matchLevel - The "strictness" level to use.
   * @param {ExactMatchSettings} [exact] - Additional threshold parameters when the {@code Exact} match level is used.
   * @param {boolean} [ignoreCaret]
   *
   * @constructor
   */
  function ImageMatchSettings(matchLevel, exact, ignoreCaret) {
    this._matchLevel = matchLevel
    this._exact = exact || null
    this._ignoreCaret = ignoreCaret || true
    this._ignoreDisplacements = false
    this._accessibilitySettings = null
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {MatchLevel} - The match level to use.
   */
  ImageMatchSettings.prototype.getMatchLevel = function() {
    return this._matchLevel
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {MatchLevel} matchLevel - The match level to use.
   */
  ImageMatchSettings.prototype.setMatchLevel = function(matchLevel) {
    this._matchLevel = matchLevel
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {ExactMatchSettings} - The additional threshold parameters when the {@code Exact} match level is used, if any.
   */
  ImageMatchSettings.prototype.getExact = function() {
    return this._exact
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {ExactMatchSettings|null} exact - The additional threshold parameters when the {@code Exact} match level is used.
   */
  ImageMatchSettings.prototype.setExact = function(exact) {
    this._exact = exact
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  ImageMatchSettings.prototype.isIgnoreCaret = function() {
    return this._ignoreCaret
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} ignoreCaret
   */
  ImageMatchSettings.prototype.setIgnoreCaret = function(ignoreCaret) {
    this._ignoreCaret = ignoreCaret
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  ImageMatchSettings.prototype.getIgnoreDisplacements = function() {
    return this._ignoreDisplacements
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} value
   */
  ImageMatchSettings.prototype.setIgnoreDisplacements = function(value) {
    this._ignoreDisplacements = value
  }

  /**
   * @return {AccessibilitySettings}
   */
  ImageMatchSettings.prototype.getAccessibilitySettings = function() {
    return this._accessibilitySettings
  }

  /**
   * @param {AccessibilitySettings} value
   */
  ImageMatchSettings.prototype.setAccessibilitySettings = function(value) {
    this._accessibilitySettings = value
  }

  Object.freeze(MatchLevel)

  /**
   * Encapsulates match settings for the a session.
   */
  exports.MatchLevel = MatchLevel
  exports.ImageMatchSettings = ImageMatchSettings
  exports.ExactMatchSettings = ExactMatchSettings
})()
