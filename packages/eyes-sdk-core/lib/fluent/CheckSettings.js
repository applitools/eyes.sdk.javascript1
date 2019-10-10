'use strict';

const { Region, GeneralUtils, MatchLevel, FloatingMatchSettings, AccessibilityMatchSettings } = require('@applitools/eyes-common');

const { GetRegion } = require('./GetRegion');
const { IgnoreRegionByRectangle } = require('./IgnoreRegionByRectangle');
const { FloatingRegionByRectangle } = require('./FloatingRegionByRectangle');
const { AccessibilityRegionByRectangle } = require('./AccessibilityRegionByRectangle');
const { GetFloatingRegion } = require('./GetFloatingRegion');
const { GetAccessibilityRegion } = require('./GetAccessibilityRegion');

/**
 * The Match settings object to use in the various Eyes.Check methods.
 */
class CheckSettings {
  /**
   * @param {?number} [timeout=-1]
   * @param {Region|RegionObject} [region]
   */
  constructor(timeout = -1, region) {
    // /** @type {string} */
    // this._name = undefined;
    /** @type {boolean} */
    this._sendDom = undefined;
    /** @type {MatchLevel} */
    this._matchLevel = undefined;
    /** @type {AccessibilityLevel} */
    this._accessibilityLevel = undefined;
    /** @type {boolean} */
    this._useDom = undefined;
    /** @type {boolean} */
    this._enablePatterns = undefined;
    /** @type {boolean} */
    this._ignoreDisplacements = undefined;
    /** @type {boolean} */
    this._ignoreCaret = false;
    /** @type {boolean} */
    this._stitchContent = false;
    /** @type {string} */
    this._renderId = undefined;

    this._timeout = timeout;
    this._targetRegion = region ? new Region(region) : undefined;

    this._ignoreRegions = [];
    this._layoutRegions = [];
    this._strictRegions = [];
    this._contentRegions = [];
    this._floatingRegions = [];
    this._accessibilityRegions = [];
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * A setter for the checkpoint name.
   *
   * @param {string} name - A name by which to identify the checkpoint.
   * @return {this} - This instance of the settings object.
   */
  withName(name) {
    this._name = name;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @ignore
   * @return {string}
   */
  getName() {
    return this._name;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines whether to send the document DOM or not.
   *
   * @param {boolean} [sendDom=true] - When {@code true} sends the DOM to the server (the default).
   * @return {this} - This instance of the settings object.
   */
  sendDom(sendDom = true) {
    this._sendDom = sendDom;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the render ID of the screenshot.
   *
   * @package
   * @param {string} renderId - The render ID to use.
   * @return {this} - This instance of the settings object.
   */
  renderId(renderId) {
    this._renderId = renderId;
    return this;
  }

  /**
   * @ignore
   * @return {string}
   */
  getRenderId() {
    return this._renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
   *
   * @return {this} - This instance of the settings object.
   */
  layout() {
    this._matchLevel = MatchLevel.Layout;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.EXACT}.
   *
   * @return {this} - This instance of the settings object.
   */
  exact() {
    this._matchLevel = MatchLevel.Exact;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.STRICT}.
   *
   * @return {this} - This instance of the settings object.
   */
  strict() {
    this._matchLevel = MatchLevel.Strict;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
   *
   * @return {this} - This instance of the settings object.
   */
  content() {
    this._matchLevel = MatchLevel.Content;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the match level by which to compare the screenshot.
   *
   * @param {MatchLevel} matchLevel - The match level to use.
   * @return {this} - This instance of the settings object.
   */
  matchLevel(matchLevel) {
    this._matchLevel = matchLevel;
    return this;
  }

  /**
   * @ignore
   * @return {MatchLevel}
   */
  getMatchLevel() {
    return this._matchLevel;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Set the accessibilityLevel level for the screenshot.
   *
   * @param {AccessibilityLevel} accessibilityLevel - The accessibilityLevel level to use.
   * @return {this} - This instance of the settings object.
   */
  accessibilityValidation(accessibilityLevel) {
    this._accessibilityLevel = accessibilityLevel;
    return this;
  }

  /**
   * @ignore
   * @return {AccessibilityLevel}
   */
  getAccessibilityValidation() {
    return this._accessibilityLevel;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines if to detect and ignore a blinking caret in the screenshot.
   *
   * @param {boolean} [ignoreCaret=true] - Whether or not to detect and ignore a blinking caret in the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreCaret(ignoreCaret = true) {
    this._ignoreCaret = ignoreCaret;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getIgnoreCaret() {
    return this._ignoreCaret;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   *
   * @param {boolean} [fully=true]
   * @return {this} - This instance of the settings object.
   */
  fully(fully = true) {
    this._stitchContent = fully;
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} [stitchContent=true]
   * @return {this}
   */
  stitchContent(stitchContent = true) {
    this._stitchContent = stitchContent;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getStitchContent() {
    return this._stitchContent;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines useDom for enabling the match algorithm to use dom.
   *
   * @param {boolean} [useDom=true]
   * @return {this} - This instance of the settings object.
   */
  useDom(useDom = true) {
    this._useDom = useDom;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Enabling the match algorithms for pattern detection
   *
   * @param {boolean} [enablePatterns=true]
   * @return {this} - This instance of the settings object.
   */
  enablePatterns(enablePatterns = true) {
    this._enablePatterns = enablePatterns;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getEnablePatterns() {
    return this._enablePatterns;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {boolean} [ignoreDisplacements=true]
   * @return {this} - This instance of the settings object.
   */
  ignoreDisplacements(ignoreDisplacements = true) {
    this._ignoreDisplacements = ignoreDisplacements;
    return this;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Defines the timeout to use when acquiring and comparing screenshots.
   *
   * @param {number} timeoutMilliseconds - The timeout to use in milliseconds.
   * @return {this} - This instance of the settings object.
   */
  timeout(timeoutMilliseconds) {
    this._timeout = timeoutMilliseconds;
    return this;
  }

  /**
   * @ignore
   * @return {number}
   */
  getTimeout() {
    return this._timeout;
  }

  /**
   * @protected
   * @param {Region|RegionObject} region
   */
  updateTargetRegion(region) {
    this._targetRegion = new Region(region);
  }

  /**
   * @ignore
   * @return {Region}
   */
  getTargetRegion() {
    return this._targetRegion;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @protected
   * @param {GetRegion|Region|RegionObject} region
   * @return {GetRegion}
   */
  _regionToRegionProvider(region) {
    if (region instanceof GetRegion) {
      return region;
    }

    if (Region.isRegionCompatible(region)) {
      return new IgnoreRegionByRectangle(new Region(region));
    }

    throw new TypeError('Method called with argument of unknown type!');
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds one or more ignore regions.
   *
   * @param {...(GetRegion|Region)} regions - A region to ignore when validating the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreRegions(...regions) {
    if (!regions) {
      throw new TypeError('ignoreRegions method called without arguments!');
    }

    regions.forEach((region) => {
      this._ignoreRegions.push(this._regionToRegionProvider(region));
    });

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds one or more layout regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Layout method.
   * @return {this} - This instance of the settings object.
   */
  layoutRegions(...regions) {
    if (!regions) {
      throw new TypeError('layoutRegions method called without arguments!');
    }

    regions.forEach((region) => {
      this._layoutRegions.push(this._regionToRegionProvider(region));
    });

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds one or more strict regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Strict method.
   * @return {this} - This instance of the settings object.
   */
  strictRegions(...regions) {
    if (!regions) {
      throw new TypeError('strictRegions method called without arguments!');
    }

    regions.forEach((region) => {
      this._strictRegions.push(this._regionToRegionProvider(region));
    });

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds one or more content regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Content method.
   * @return {this} - This instance of the settings object.
   */
  contentRegions(...regions) {
    if (!regions) {
      throw new TypeError('contentRegions method called without arguments!');
    }

    regions.forEach((region) => {
      this._contentRegions.push(this._regionToRegionProvider(region));
    });

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger
   * region.
   *
   * @param {GetFloatingRegion|Region|FloatingMatchSettings} regionOrContainer - The content rectangle or region
   *   container
   * @param {number} [maxUpOffset] - How much the content can move up.
   * @param {number} [maxDownOffset] - How much the content can move down.
   * @param {number} [maxLeftOffset] - How much the content can move to the left.
   * @param {number} [maxRightOffset] - How much the content can move to the right.
   * @return {this} - This instance of the settings object.
   */
  floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (regionOrContainer instanceof GetFloatingRegion) {
      this._floatingRegions.push(regionOrContainer);
    } else if (regionOrContainer instanceof FloatingMatchSettings) {
      this._floatingRegions.push(new FloatingRegionByRectangle(
        regionOrContainer.getRegion(),
        regionOrContainer.getMaxUpOffset(),
        regionOrContainer.getMaxDownOffset(),
        regionOrContainer.getMaxLeftOffset(),
        regionOrContainer.getMaxRightOffset()
      ));
    } else if (Region.isRegionCompatible(regionOrContainer)) {
      this._floatingRegions.push(new FloatingRegionByRectangle(
        new Region(regionOrContainer),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset
      ));
    } else {
      throw new TypeError('Method called with argument of unknown type!');
    }

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a
   * bigger region.
   *
   * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
   * @param {...Region} regionsOrContainers - One or more content rectangles or region containers
   * @return {this} - This instance of the settings object.
   */
  floatingRegions(maxOffset, ...regionsOrContainers) {
    if (!regionsOrContainers) {
      throw new TypeError('floatingRegions method called without arguments!');
    }

    regionsOrContainers.forEach((region) => {
      this.floatingRegion(region, maxOffset, maxOffset, maxOffset, maxOffset);
    });

    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type.
   *
   * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings} regionOrContainer - The content rectangle or
   *   region container
   * @param {AccessibilityRegionType} [regionType] - Type of accessibility.
   * @return {this} - This instance of the settings object.
   */
  accessibilityRegion(regionOrContainer, regionType) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (regionOrContainer instanceof GetAccessibilityRegion) {
      this._accessibilityRegions.push(regionOrContainer);
    } else if (regionOrContainer instanceof AccessibilityMatchSettings) {
      this._accessibilityRegions.push(new AccessibilityRegionByRectangle(
        regionOrContainer.getRegion(),
        regionOrContainer.getType()
      ));
    } else if (Region.isRegionCompatible(regionOrContainer)) {
      this._accessibilityRegions.push(new AccessibilityRegionByRectangle(
        new Region(regionOrContainer),
        regionType
      ));
    } else {
      throw new TypeError('Method called with argument of unknown type!');
    }

    return this;
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getIgnoreRegions() {
    return this._ignoreRegions;
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getStrictRegions() {
    return this._strictRegions;
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getLayoutRegions() {
    return this._layoutRegions;
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getContentRegions() {
    return this._contentRegions;
  }

  /**
   * @ignore
   * @return {GetFloatingRegion[]}
   */
  getFloatingRegions() {
    return this._floatingRegions;
  }

  /**
   * @ignore
   * @return {GetAccessibilityRegion[]}
   */
  getAccessibilityRegions() {
    return this._accessibilityRegions;
  }

  /**
   * @override
   */
  toString() {
    return `${this.constructor.name} ${GeneralUtils.toString(this)}`;
  }
}

exports.CheckSettings = CheckSettings;
