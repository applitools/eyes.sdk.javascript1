'use strict'

const {
  Region,
  GeneralUtils,
  MatchLevel,
  FloatingMatchSettings,
  AccessibilityMatchSettings,
} = require('../..')

const GetRegion = require('./GetRegion')
const IgnoreRegionByRectangle = require('./IgnoreRegionByRectangle')
const FloatingRegionByRectangle = require('./FloatingRegionByRectangle')
const AccessibilityRegionByRectangle = require('./AccessibilityRegionByRectangle')
const GetFloatingRegion = require('./GetFloatingRegion')
const GetAccessibilityRegion = require('./GetAccessibilityRegion')

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
    this._sendDom = undefined
    /** @type {MatchLevel} */
    this._matchLevel = undefined
    /** @type {AccessibilityLevel} */
    this._accessibilityLevel = undefined
    /** @type {boolean} */
    this._useDom = undefined
    /** @type {boolean} */
    this._enablePatterns = undefined
    /** @type {boolean} */
    this._ignoreDisplacements = undefined
    /** @type {boolean} */
    this._ignoreCaret = true
    /** @type {boolean} */
    this._stitchContent = false
    /** @type {string} */
    this._renderId = undefined

    this._timeout = timeout
    this._targetRegion = region ? new Region(region) : undefined

    this._ignoreRegions = []
    this._layoutRegions = []
    this._strictRegions = []
    this._contentRegions = []
    this._floatingRegions = []
    this._accessibilityRegions = []
  }

  /**
   * A setter for the checkpoint name.
   *
   * @param {string} name - A name by which to identify the checkpoint.
   * @return {this} - This instance of the settings object.
   */
  withName(name) {
    this._name = name
    return this
  }

  /**
   * @ignore
   * @return {string}
   */
  getName() {
    return this._name
  }

  /**
   * Defines whether to send the document DOM or not.
   *
   * @param {boolean} [sendDom=true] - When {@code true} sends the DOM to the server (the default).
   * @return {this} - This instance of the settings object.
   */
  sendDom(sendDom = true) {
    this._sendDom = sendDom
    return this
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom
  }

  /**
   * Set the render ID of the screenshot.
   *
   * @package
   * @param {string} renderId - The render ID to use.
   * @return {this} - This instance of the settings object.
   */
  renderId(renderId) {
    this._renderId = renderId
    return this
  }

  /**
   * @ignore
   * @return {string}
   */
  getRenderId() {
    return this._renderId
  }

  /**
   * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
   *
   * @return {this} - This instance of the settings object.
   */
  layout() {
    this._matchLevel = MatchLevel.Layout
    return this
  }

  /**
   * Shortcut to set the match level to {@code MatchLevel.EXACT}.
   *
   * @return {this} - This instance of the settings object.
   */
  exact() {
    this._matchLevel = MatchLevel.Exact
    return this
  }

  /**
   * Shortcut to set the match level to {@code MatchLevel.STRICT}.
   *
   * @return {this} - This instance of the settings object.
   */
  strict() {
    this._matchLevel = MatchLevel.Strict
    return this
  }

  /**
   * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
   *
   * @return {this} - This instance of the settings object.
   */
  content() {
    this._matchLevel = MatchLevel.Content
    return this
  }

  /**
   * Set the match level by which to compare the screenshot.
   *
   * @param {MatchLevel} matchLevel - The match level to use.
   * @return {this} - This instance of the settings object.
   */
  matchLevel(matchLevel) {
    this._matchLevel = matchLevel
    return this
  }

  /**
   * @ignore
   * @return {MatchLevel}
   */
  getMatchLevel() {
    return this._matchLevel
  }

  /**
   * Defines if to detect and ignore a blinking caret in the screenshot.
   *
   * @param {boolean} [ignoreCaret=true] - Whether or not to detect and ignore a blinking caret in the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreCaret(ignoreCaret = true) {
    this._ignoreCaret = ignoreCaret
    return this
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getIgnoreCaret() {
    return this._ignoreCaret
  }

  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   *
   * @param {boolean} [fully=true]
   * @return {this} - This instance of the settings object.
   */
  fully(fully = true) {
    this._stitchContent = fully
    return this
  }

  /**
   * @param {boolean} [stitchContent=true]
   * @return {this}
   */
  stitchContent(stitchContent = true) {
    return this.fully(stitchContent)
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getStitchContent() {
    return this._stitchContent
  }

  /**
   * Defines useDom for enabling the match algorithm to use dom.
   *
   * @param {boolean} [useDom=true]
   * @return {this} - This instance of the settings object.
   */
  useDom(useDom = true) {
    this._useDom = useDom
    return this
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom
  }

  /**
   * Enabling the match algorithms for pattern detection
   *
   * @param {boolean} [enablePatterns=true]
   * @return {this} - This instance of the settings object.
   */
  enablePatterns(enablePatterns = true) {
    this._enablePatterns = enablePatterns
    return this
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getEnablePatterns() {
    return this._enablePatterns
  }

  /**
   * @param {boolean} [ignoreDisplacements=true]
   * @return {this} - This instance of the settings object.
   */
  ignoreDisplacements(ignoreDisplacements = true) {
    this._ignoreDisplacements = ignoreDisplacements
    return this
  }

  /**
   * @ignore
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements
  }

  /**
   * Defines the timeout to use when acquiring and comparing screenshots.
   *
   * @param {number} timeoutMilliseconds - The timeout to use in milliseconds.
   * @return {this} - This instance of the settings object.
   */
  timeout(timeoutMilliseconds = -1) {
    this._timeout = timeoutMilliseconds
    return this
  }

  /**
   * @ignore
   * @return {number}
   */
  getTimeout() {
    return this._timeout
  }

  /**
   * @protected
   * @param {Region|RegionObject} region
   */
  updateTargetRegion(region) {
    this._targetRegion = new Region(region)
  }

  /**
   * @ignore
   * @return {Region}
   */
  getTargetRegion() {
    return this._targetRegion
  }

  /**
   * @protected
   * @param {GetRegion|Region|RegionObject} region
   * @return {GetRegion}
   */
  _regionToRegionProvider(region) {
    if (region instanceof GetRegion) {
      return region
    }

    if (Region.isRegionCompatible(region)) {
      return new IgnoreRegionByRectangle(new Region(region))
    }

    throw new TypeError('Method called with argument of unknown type!')
  }

  _getTargetType() {
    return !this._targetRegion ? 'window' : 'region'
  }

  /**
   * Adds a region to ignore.
   *
   * @override
   * @param {GetRegion|Region|By|String|EyesWebElement|Object} region The region or region container to ignore when validating the screenshot.
   * @return {CheckSettings} This instance of the settings object.
   */
  ignore(region) {
    return this.ignoreRegion(region)
  }

  /**
   * Adds a region to ignore.
   *
   * @override
   * @param {GetRegion|Region|By|String|EyesWebElement|Object} region The region or region container to ignore when validating the screenshot.
   * @return {CheckSettings} This instance of the settings object.
   */
  ignoreRegion(region) {
    let ignoreRegion
    if (region instanceof GetRegion) {
      ignoreRegion = region
    } else if (Region.isRegionCompatible(region)) {
      ignoreRegion = new IgnoreRegionByRectangle(new Region(region))
    } else {
      //TODO remove it after all SDK will be migrated to the common core
      ignoreRegion = this._regionToRegionProvider(region)
    }
    this._ignoreRegions.push(ignoreRegion)

    return this
  }

  /**
   * Adds one or more ignore regions.
   *
   * @param {...(GetRegion|Region)} regions - A region to ignore when validating the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignores(...regions) {
    return this.ignoreRegions(...regions)
  }

  /**
   * Adds one or more ignore regions.
   *
   * @param {...(GetRegion|Region)} regions - A region to ignore when validating the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreRegions(...regions) {
    regions.forEach(region => this.ignoreRegion(region))
    return this
  }

  /**
   * Adds a layout region.
   * @param {GetRegion|Region} region - A region to match using the Layout method.
   * @return {this} - This instance of the settings object.
   */
  layoutRegion(region) {
    let layoutRegion
    if (region instanceof GetRegion) {
      layoutRegion = region
    } else if (Region.isRegionCompatible(region)) {
      layoutRegion = new IgnoreRegionByRectangle(new Region(region))
    } else {
      //TODO remove it after all SDK will be migrated to the common core
      layoutRegion = this._regionToRegionProvider(region)
    }
    this._layoutRegions.push(layoutRegion)

    return this
  }

  /**
   * Adds one or more layout regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Layout method.
   * @return {this} - This instance of the settings object.
   */
  layoutRegions(...regions) {
    regions.forEach(region => this.layoutRegion(region))
    return this
  }

  /**
   * Adds a strict regions.
   * @param {GetRegion|Region} region - A region to match using the Strict method.
   * @return {this} - This instance of the settings object.
   */
  strictRegion(region) {
    let strictRegion
    if (region instanceof GetRegion) {
      strictRegion = region
    } else if (Region.isRegionCompatible(region)) {
      strictRegion = new IgnoreRegionByRectangle(new Region(region))
    } else {
      //TODO remove it after all SDK will be migrated to the common core
      strictRegion = this._regionToRegionProvider(region)
    }
    this._strictRegions.push(strictRegion)

    return this
  }

  /**
   * Adds one or more strict regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Strict method.
   * @return {this} - This instance of the settings object.
   */
  strictRegions(...regions) {
    regions.forEach(region => this.strictRegion(region))
    return this
  }

  /**
   * Adds a content region.
   * @param {GetRegion|Region} region - A region to match using the Content method.
   * @return {this} - This instance of the settings object.
   */
  contentRegion(region) {
    let contentRegion
    if (region instanceof GetRegion) {
      contentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      contentRegion = new IgnoreRegionByRectangle(new Region(region))
    } else {
      //TODO remove it after all SDK will be migrated to the common core
      contentRegion = this._regionToRegionProvider(region)
    }
    this._contentRegions.push(contentRegion)

    return this
  }

  /**
   * Adds one or more content regions.
   * @param {...(GetRegion|Region)} regions - A region to match using the Content method.
   * @return {this} - This instance of the settings object.
   */
  contentRegions(...regions) {
    regions.forEach(region => this.contentRegion(region))
    return this
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger
   * region.
   *
   * @param {GetFloatingRegion|Region|FloatingMatchSettings} region - The content rectangle or region
   *   container
   * @param {number} [maxUpOffset] - How much the content can move up.
   * @param {number} [maxDownOffset] - How much the content can move down.
   * @param {number} [maxLeftOffset] - How much the content can move to the left.
   * @param {number} [maxRightOffset] - How much the content can move to the right.
   * @return {this} - This instance of the settings object.
   */
  floating(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger
   * region.
   *
   * @param {GetFloatingRegion|Region|FloatingMatchSettings} region - The content rectangle or region
   *   container
   * @param {number} [maxUpOffset] - How much the content can move up.
   * @param {number} [maxDownOffset] - How much the content can move down.
   * @param {number} [maxLeftOffset] - How much the content can move to the left.
   * @param {number} [maxRightOffset] - How much the content can move to the right.
   * @return {this} - This instance of the settings object.
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let floatingRegion
    if (region instanceof GetFloatingRegion) {
      floatingRegion = region
    } else if (region instanceof FloatingMatchSettings) {
      floatingRegion = new FloatingRegionByRectangle(
        region.getRegion(),
        region.getMaxUpOffset(),
        region.getMaxDownOffset(),
        region.getMaxLeftOffset(),
        region.getMaxRightOffset(),
      )
    } else if (Region.isRegionCompatible(region)) {
      floatingRegion = new FloatingRegionByRectangle(
        new Region(region),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._floatingRegions.push(floatingRegion)

    return this
  }

  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries of a
   * bigger region.
   *
   * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
   * @param {...Region} regions - One or more content rectangles or region containers
   * @return {this} - This instance of the settings object.
   */
  floatings(maxOffset, ...regions) {
    return this.floatingRegions(maxOffset, ...regions)
  }

  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries of a
   * bigger region.
   *
   * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
   * @param {...Region} regions - One or more content rectangles or region containers
   * @return {this} - This instance of the settings object.
   */
  floatingRegions(maxOffset, ...regions) {
    regions.forEach(region =>
      this.floatingRegion(region, maxOffset, maxOffset, maxOffset, maxOffset),
    )
    return this
  }

  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type.
   *
   * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings} region - The content rectangle or
   *   region container
   * @param {AccessibilityRegionType} regionType - Type of accessibility.
   * @return {this} - This instance of the settings object.
   */
  accessibilityRegion(region, regionType) {
    let accessibilityRegion
    if (region instanceof GetAccessibilityRegion) {
      accessibilityRegion = region
    } else if (region instanceof AccessibilityMatchSettings) {
      accessibilityRegion = new AccessibilityRegionByRectangle(region.getRegion(), region.getType())
    } else if (Region.isRegionCompatible(region)) {
      accessibilityRegion = new AccessibilityRegionByRectangle(new Region(region), regionType)
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._accessibilityRegions.push(accessibilityRegion)

    return this
  }

  accessibility(region, regionType) {
    return this.accessibilityRegion(region, regionType)
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getIgnoreRegions() {
    return this._ignoreRegions
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getStrictRegions() {
    return this._strictRegions
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getLayoutRegions() {
    return this._layoutRegions
  }

  /**
   * @ignore
   * @return {GetRegion[]}
   */
  getContentRegions() {
    return this._contentRegions
  }

  /**
   * @ignore
   * @return {GetFloatingRegion[]}
   */
  getFloatingRegions() {
    return this._floatingRegions
  }

  /**
   * @ignore
   * @return {GetAccessibilityRegion[]}
   */
  getAccessibilityRegions() {
    return this._accessibilityRegions
  }

  /**
   * @override
   */
  toString() {
    return `${this.constructor.name} ${GeneralUtils.toString(this)}`
  }

  async toCheckWindowConfiguration(eyesWebDriver) {
    const regions = await this._getPersistedRegions(eyesWebDriver)
    return {
      ...regions,
      target: this._getTargetType(),
      fully: this.getStitchContent(),
      tag: this.getName(),
      scriptHooks: this.getScriptHooks(),
      sendDom: this.getSendDom(),
      matchLevel: this.getMatchLevel(),
    }
  }

  async _getPersistedRegions(eyesWebDriver) {
    const [ignore, floating, strict, layout, content, accessibility] = await Promise.all([
      persistRegions(this.getIgnoreRegions()),
      persistRegions(this.getFloatingRegions()),
      persistRegions(this.getStrictRegions()),
      persistRegions(this.getLayoutRegions()),
      persistRegions(this.getContentRegions()),
      persistRegions(this.getAccessibilityRegions()),
    ])

    return {ignore, floating, strict, layout, content, accessibility}

    async function persistRegions(regions) {
      const persisted = await Promise.all(regions.map(r => r.toPersistedRegions(eyesWebDriver)))
      return [].concat(...persisted)
    }
  }
}

module.exports = CheckSettings
