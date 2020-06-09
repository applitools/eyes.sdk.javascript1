'use strict'
const {Region} = require('../geometry/Region')
const {CoordinatesType} = require('../geometry/CoordinatesType')
const CheckSettings = require('./CheckSettings')
const TargetRegionByElement = require('./TargetRegionByElement')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')

/**
 * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('../wrappers/EyesWrappedElement').SupportedElement} SupportedElement
 * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('../frames/Frame')} Frame
 * @typedef {import('../frames/Frame').FrameReference} FrameReference
 */

/**
 * Reference to the region
 * @typedef {Region|SupportedSelector|SupportedElement|EyesWrappedElement} RegionReference
 */

/**
 * @typedef {Object} SpecsCheckSettings
 * @property {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @property {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
 * @property {(selector: SupportedSelector) => EyesWrappedElement} createElementFromSelector - return partially created element
 * @property {(element: SupportedElement) => EyesWrappedElement} createElementFromElement - return partially created element
 * @property {(reference) => boolean} isFrameReference - return true if the value is a frame reference, false otherwise
 * @property {(reference: FrameReference) => Frame} createFrameReference - return frame reference
 */

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

class DriverCheckSettings extends CheckSettings {
  /**
   * @param {SpecsCheckSettings} SpecsCheckSettings
   * @return {DriverCheckSettings} specialized version of this class
   */
  static specialize(SpecsCheckSettings) {
    return class extends DriverCheckSettings {
      /** @override */
      static get specs() {
        return SpecsCheckSettings
      }
      /** @override */
      get specs() {
        return SpecsCheckSettings
      }
    }
  }
  /** @type {SpecsCheckSettings} */
  static get specs() {
    throw new TypeError('DriverCheckSettings is not specialized')
  }
  /** @type {SpecsCheckSettings} */
  get specs() {
    throw new TypeError('DriverCheckSettings is not specialized')
  }

  /**
   * Create check settings with bound region and/or frame
   * @param {RegionReference} [region]
   * @param {FrameReference} [frame]
   */
  constructor(region, frame) {
    super()
    /** @type {EyesWrappedElement} */
    this._targetElement = null
    /** @type {Frame[]} */
    this._frameChain = []
    /** @type {Object<string, string>} */
    this._scriptHooks = {}

    if (region) {
      this.region(region)
    }
    if (frame) {
      this.frame(frame)
    }
  }

  /**
   * Create check settings without target
   * @return {DriverCheckSettings} check settings object
   */
  static window() {
    return new this()
  }

  /**
   * Create check settings with bound region and frame
   * @param {RegionReference} region
   * @param {FrameReference} [frame]
   * @return {DriverCheckSettings} check settings object
   */
  static region(region, frame) {
    return new this(region, frame)
  }

  /**
   * Create check settings with bound frame
   * @param {FrameReference} frame
   * @return {DriverCheckSettings} check settings object
   */
  static frame(frame) {
    return new this(null, frame)
  }

  /**
   * Adds a region to ignore
   * @override
   * @param {RegionReference} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignoreRegion(region) {
    let ignoreRegion
    if (this.specs.isSelector(region)) {
      ignoreRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      ignoreRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.ignoreRegion(region)
    }
    this._ignoreRegions.push(ignoreRegion)

    return this
  }

  /**
   * Adds a layout region
   * @override
   * @param {RegionReference} region - region reference to match as layout when validating the screenshot
   * @return {this} this instance for chaining
   */
  layoutRegion(region) {
    let layoutRegion
    if (this.specs.isSelector(region)) {
      layoutRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      layoutRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.layoutRegion(region)
    }
    this._layoutRegions.push(layoutRegion)

    return this
  }

  /**
   * Adds a strict region
   * @param {RegionReference} region - region reference to match as strict when validating the screenshot
   * @return {this} this instance for chaining
   */
  strictRegion(region) {
    let strictRegion
    if (this.specs.isSelector(region)) {
      strictRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      strictRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.strictRegion(region)
    }
    this._strictRegions.push(strictRegion)

    return this
  }

  /**
   * Adds a content region
   * @param {RegionReference} region - region reference to match as content when validating the screenshot
   * @return {this} this instance for chaining
   */
  contentRegion(region) {
    let contentRegion
    if (this.specs.isSelector(region)) {
      contentRegion = new IgnoreRegionBySelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      contentRegion = new IgnoreRegionByElement(this.specs.createElementFromElement(region))
    } else {
      return super.contentRegion(region)
    }
    this._contentRegions.push(contentRegion)

    return this
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let floatingRegion
    if (this.specs.isSelector(region)) {
      floatingRegion = new FloatingRegionBySelector(
        region,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else if (this.specs.isCompatibleElement(region)) {
      floatingRegion = new FloatingRegionByElement(
        this.specs.createElementFromElement(region),
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    } else {
      return super.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
    }
    this._floatingRegions.push(floatingRegion)

    return this
  }

  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibilityRegion(region, regionType) {
    let accessibilityRegion
    if (this.specs.isSelector(region)) {
      accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
    } else if (this.specs.isCompatibleElement(region)) {
      accessibilityRegion = new AccessibilityRegionByElement(
        this.specs.createElementFromElement(region),
        regionType,
      )
    } else {
      return super.accessibilityRegion(region, regionType)
    }
    this._accessibilityRegions.push(accessibilityRegion)

    return this
  }

  /**
   * @param {RegionReference} region
   * @returns {this}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      this._targetRegion = new Region(region)
      this._targetRegion.setCoordinatesType(CoordinatesType.CONTEXT_RELATIVE)
    } else if (this.specs.isSelector(region)) {
      this._targetElement = this.specs.createElementFromSelector(region)
    } else if (this.specs.isCompatibleElement(region)) {
      this._targetElement = this.specs.createElementFromElement(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {FrameReference} frame - the frame to switch to
   * @returns {this}
   */
  frame(frameReference) {
    if (this.specs.isFrameReference(frameReference)) {
      this._frameChain.push(this.specs.createFrameReference(frameReference))
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {SupportedSelector|SupportedElement|EyesWrappedElement} element
   * @return {this}
   */
  scrollRootElement(element) {
    let scrollRootElement
    if (this.specs.isSelector(element)) {
      scrollRootElement = this.specs.createElementFromSelector(element)
    } else if (this.specs.isCompatibleElement(element)) {
      scrollRootElement = this.specs.createElementFromElement(element)
    } else {
      throw new TypeError('scrollRootElement method called with argument of unknown type!')
    }

    if (this._frameChain.length === 0) {
      this._scrollRootElement = scrollRootElement
    } else {
      const frameReference = this._frameChain[this._frameChain.length - 1]
      frameReference.scrollRootElement = scrollRootElement
    }

    return this
  }

  /**
   * @ignore
   * @return {Promise<EyesWrappedElement>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }

  /**
   * @return {?TargetRegionByElement}
   */
  getTargetProvider() {
    if (this._targetElement) {
      return new TargetRegionByElement(this._targetElement)
    }
  }

  /**
   * @return {EyesWrappedElement}
   */
  get targetElement() {
    return this._targetElement
  }

  /**
   * @return {Frame[]}
   */
  getFrameChain() {
    return this._frameChain
  }

  /**
   * @return {Frame[]}
   */
  get frameChain() {
    return Array.from(this._frameChain)
  }

  _getTargetType() {
    return !this._targetRegion && !this._targetElement ? 'window' : 'region'
  }

  /**
   * @deprecated
   * @param {String} hook
   * @return {this}
   */
  webHook(hook) {
    return this.beforeRenderScreenshotHook(hook)
  }

  /**
   * @param {String} hook
   * @return {this}
   */
  beforeRenderScreenshotHook(hook) {
    this._scriptHooks[BEFORE_CAPTURE_SCREENSHOT] = hook
    return this
  }

  /**
   * @ignore
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks
  }
}

module.exports = DriverCheckSettings
