'use strict'
const Region = require('../geometry/Region')
const MatchLevel = require('../config/MatchLevel')
const CoordinatesType = require('../geometry/CoordinatesType')
const FloatingMatchSettings = require('../config/FloatingMatchSettings')
const AccessibilityMatchSettings = require('../config/AccessibilityMatchSettings')
const FluentRegion = require('./FluentRegion')

const GeneralUtils = require('../utils/GeneralUtils')
const TypeUtils = require('../utils/TypeUtils')

/**
 * @typedef {import('../geometry/Region')} Region
 */

/**
 * @template TElement, TSelector
 * @typedef {import('../wrappers/EyesWrappedElement')<any, TElement, TSelector>} EyesWrappedElement
 */

/**
 * @template TElement, TSelector
 * @typedef {import('../frames/Frame')<any, TElement, TSelector>} Frame
 */

/**
 * @template TElement, TSelector
 * @typedef {import('../frames/Frame').FrameReference<any, TElement, TSelector>} FrameReference
 */

/**
 * @template TElement, TSelector
 * @typedef {EyesWrappedElement<TElement, TSelector>|TElement|TSelector} ElementReference
 */

/**
 * @template TElement, TSelector
 * @typedef {ElementReference<TElement, TSelector>|Region} RegionReference
 */

/**
 * @template TElement, TSelector
 * @typedef FloatingRegionReference
 * @prop {RegionReference<TElement, TSelector>} region
 * @prop {number} [maxUpOffset] - how much the content can move up
 * @prop {number} [maxDownOffset] - how much the content can move down
 * @prop {number} [maxLeftOffset] - how much the content can move to the left
 * @prop {number} [maxRightOffset] - how much the content can move to the right
 */

/**
 * @template TElement, TSelector
 * @typedef AccessibilityRegionReference
 * @prop {RegionReference<TElement, TSelector>} region
 * @prop {AccessibilityRegionType} [type]
 */

/**
 * @template TElement, TSelector
 * @typedef PlainCheckSettings
 * @prop {string} [name]
 * @prop {MatchLevel} [matchLevel]
 * @prop {number} [timeout=-1]
 * @prop {boolean} [sendDom=true]
 * @prop {boolean} [useDom=true]
 * @prop {boolean} [enablePatterns=true]
 * @prop {boolean} [ignoreDisplacements=true]
 * @prop {boolean} [ignoreCaret=true]
 * @prop {Object<string, any>} [visualGridOptions]
 * @prop {number[]|boolean} [layoutBreakpoints]
 * @prop {boolean} [isFully=false]
 * @prop {string} [renderId]
 * @prop {{[key: string]: string}} [hooks]
 * @prop {RegionReference<TElement, TSelector>} [region]
 * @prop {({frame: FrameReference<TElement, TSelector>, scrollRootElement?: ElementReference<TElement, TSelector>}|FrameReference<TElement, TSelector>)[]} [frames]
 * @prop {ElementReference<TElement, TSelector>} [scrollRootElement]
 * @prop {RegionReference<TElement, TSelector>[]} [ignoreRegions]
 * @prop {RegionReference<TElement, TSelector>[]} [layoutRegions]
 * @prop {RegionReference<TElement, TSelector>[]} [strictRegions]
 * @prop {RegionReference<TElement, TSelector>[]} [contentRegions]
 * @prop {(FloatingRegionReference<TElement, TSelector>|RegionReference<TElement, TSelector>)[]} [floatingRegions]
 * @prop {(AccessibilityRegionReference<TElement, TSelector>|RegionReference<TElement, TSelector>)[]} [accessibilityRegions]
 */

/**
 * @template TElement, TSelector
 * @typedef SpecCheckSettings
 * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
 * @prop {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
 * @prop {(reference) => boolean} isFrameReference - return true if the value is a frame reference, false otherwise
 * @prop {(selector: TSelector) => EyesWrappedElement<TElement, TSelector>} createElementFromSelector - return partially created element
 * @prop {(element: TElement) => EyesWrappedElement<TElement, TSelector>} createElementFromElement - return partially created element
 * @prop {(reference: FrameReference<TElement, TSelector>) => Frame<TElement, TSelector>} createFrameReference - return frame reference
 */

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

/**
 * @template TElement, TSelector
 * @typedef {new (checkSettings?: PlainCheckSettings<TElement, TSelector>) => CheckSettings<TElement, TSelector>} CheckSettingsCtor
 */

/**
 * @template TElement, TSelector
 * @typedef CheckSettingsStatics
 * @prop {(object: PlainCheckSettings<TElement, TSelector>) => CheckSettings<TElement, TSelector>} from
 * @prop {() => CheckSettings<TElement, TSelector>} window
 * @prop {(frame: FrameReference<TElement, TSelector>) => CheckSettings<TElement, TSelector>} frame
 * @prop {(region: RegionReference<TElement, TSelector>, frame?: FrameReference<TElement, TSelector>) => CheckSettings<TElement, TSelector>} region
 */

/**
 * @template TElement - TElement provided by wrapped framework
 * @template TSelector - TSelector supported by framework
 */
class CheckSettings {
  static get __CheckSettings() {
    return true
  }
  /**
   * @template TElement, TSelector
   * @param {SpecCheckSettings<TElement, TSelector>} spec
   * @return {CheckSettingsCtor<TElement, TSelector> & CheckSettingsStatics<TElement, TSelector>} specialized version of this class
   */
  static specialize(spec) {
    return class extends CheckSettings {
      /** @override */
      get spec() {
        return spec
      }
    }
  }
  /** @type {SpecCheckSettings<TElement, TSelector>} */
  get spec() {
    throw new TypeError('CheckSettings is not specialized')
  }
  /**
   * Create check settings with bound region and/or frame
   * @param {PlainCheckSettings<TElement, TSelector>} [checkSettings]
   */
  constructor(checkSettings) {
    if (checkSettings) {
      return TypeUtils.instanceOf(checkSettings, CheckSettings)
        ? checkSettings
        : this.constructor.from(checkSettings)
    }
    /** @private @type {Frame<TElement, TSelector>[]} */
    this._context = null
    this._scrollRootElement = undefined
    /** @private @type {EyesElement<TElement, TSelector>} */
    this._targetElement = null
    /** @private @type {Region} */
    this._targetRegion = null
    /** @private @type {GetRegion[]} */
    this._ignoreRegions = []
    /** @private @type {GetRegion[]} */
    this._layoutRegions = []
    /** @private @type {GetRegion[]} */
    this._strictRegions = []
    /** @private @type {GetRegion[]} */
    this._contentRegions = []
    /** @private @type {GetFloatingRegion[]} */
    this._floatingRegions = []
    /** @private @type {GetAccessibilityRegion[]} */
    this._accessibilityRegions = []

    /** @private @type {string} */
    this._name = undefined
    /** @private @type {number} */
    this._timeout = -1
    /** @private @type {boolean} */
    this._sendDom = undefined
    /** @private @type {MatchLevel} */
    this._matchLevel = undefined
    /** @private @type {AccessibilityLevel} */
    this._accessibilityLevel = undefined
    /** @private @type {boolean} */
    this._useDom = undefined
    /** @private @type {boolean} */
    this._enablePatterns = undefined
    /** @private @type {boolean} */
    this._ignoreDisplacements = undefined
    /** @private @type {boolean} */
    this._ignoreCaret = true
    /** @private @type {boolean} */
    this._stitchContent = false
    /** @private @type {string} */
    this._renderId = undefined
    /** @private @type {Object<string, string>} */
    this._scriptHooks = {}
    /** @private @type {Object} */
    this._visualGridOptions = undefined
    /** @private @type {number[]|boolean} */
    this._layoutBreakpoints = undefined
  }
  /**
   * Create check settings from an object
   * @template TElement, TSelector
   * @param {PlainCheckSettings<TElement, TSelector>} object
   * @return {CheckSettings<TElement, TSelector>} check settings instance
   */
  static from(object) {
    const settings = new this()
    if (object.name) {
      settings.withName(object.name)
    }
    if (object.scrollRootElement) {
      settings.scrollRootElement(object.scrollRootElement)
    }
    if (object.hooks) {
      Object.values(object.hooks).forEach(([name, script]) => {
        settings.hook(name, script)
      })
    }
    if (object.frames) {
      object.frames.forEach(reference => {
        if (!reference) return
        if (reference.frame) {
          settings.frame(reference.frame)
          if (reference.scrollRootElement) {
            settings.scrollRootElement(reference.scrollRootElement)
          }
        } else {
          settings.frame(reference)
        }
      })
    }
    if (object.region) {
      settings.region(object.region)
    }
    if (object.ignoreRegions) {
      object.ignoreRegions.forEach(ignoreRegion => settings.ignoreRegion(ignoreRegion))
    }
    if (object.layoutRegions) {
      object.layoutRegions.forEach(layoutRegion => settings.layoutRegion(layoutRegion))
    }
    if (object.strictRegions) {
      object.strictRegions.forEach(strictRegion => settings.strictRegion(strictRegion))
    }
    if (object.contentRegions) {
      object.contentRegions.forEach(contentRegion => settings.contentRegion(contentRegion))
    }
    if (object.floatingRegions) {
      object.floatingRegions.forEach(floatingRegion =>
        floatingRegion.region
          ? settings.floatingRegion(
              floatingRegion.region,
              floatingRegion.maxUpOffset,
              floatingRegion.maxDownOffset,
              floatingRegion.maxLeftOffset,
              floatingRegion.maxRightOffset,
            )
          : settings.floatingRegion(floatingRegion),
      )
    }
    if (object.accessibilityRegions) {
      object.accessibilityRegions.forEach(accessibilityRegion =>
        accessibilityRegion.region
          ? settings.accessibilityRegion(accessibilityRegion.region, accessibilityRegion.type)
          : settings.accessibilityRegion(accessibilityRegion),
      )
    }
    if (object.matchLevel) {
      settings.matchLevel(object.matchLevel)
    }
    if (!Number.isNaN(Number(object.timeout))) {
      settings.timeout(object.timeout)
    }
    if (object.sendDom !== undefined) {
      settings.sendDom(object.sendDom)
    }
    if (object.useDom !== undefined) {
      settings.useDom(object.useDom)
    }
    if (object.enablePatterns) {
      settings.enablePatterns(object.enablePatterns)
    }
    if (object.ignoreDisplacements) {
      settings.ignoreDisplacements(object.ignoreDisplacements)
    }
    if (object.ignoreCaret) {
      settings.ignoreCaret(object.ignoreCaret)
    }
    if (object.renderId) {
      settings.renderId(object.renderId)
    }
    if (object.isFully) {
      settings.fully(object.isFully)
    }
    if (object.visualGridOptions) {
      Object.entries(object.visualGridOptions).forEach(([key, value]) => {
        settings.visualGridOption(key, value)
      })
    }
    if (object.layoutBreakpoints) {
      settings.layoutBreakpoints(object.layoutBreakpoints)
    }
    if (object.disableBrowserFetching) {
      settings.disableBrowserFetching()
    }
    return settings
  }
  /**
   * Create check settings without target
   * @template TElement, TSelector
   * @return {CheckSettings<TElement, TSelector>} check settings object
   */
  static window() {
    return new this()
  }
  /**
   * Create check settings with bound region and frame
   * @template TElement, TSelector
   * @param {RegionReference<TElement, TSelector>} region
   * @param {FrameReference<TElement, TSelector>} [frame]
   * @return {CheckSettings<TElement, TSelector>} check settings object
   */
  static region(region, frame) {
    return this.from({region, frames: [frame]})
  }
  /**
   * Create check settings with bound frame
   * @template TElement, TSelector
   * @param {FrameReference<TElement, TSelector>} frame
   * @return {CheckSettings<TElement, TSelector>} check settings object
   */
  static frame(frame) {
    return this.from({frames: [frame]})
  }
  /**
   * @param {RegionReference<TElement, TSelector>} region
   * @return {this}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      this._targetRegion = new Region(region)
      this._targetRegion.setCoordinatesType(CoordinatesType.CONTEXT_RELATIVE)
      this._targetProvider = new FluentRegion({region: this._targetRegion})
    } else if (this.spec.isSelector(region)) {
      this._targetElement = region
      this._targetProvider = new FluentRegion({selector: this._targetElement})
    } else if (this.spec.isElement(region)) {
      this._targetElement = region
      this._targetProvider = new FluentRegion({element: this._targetElement})
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @private
   * @return {TargetRegionByElement}
   */
  getTargetProvider() {
    return this._targetProvider
  }
  /**
   * @private
   * @type {EyesWrappedElement<TElement, TSelector>}
   */
  getTargetRegion() {
    return this._targetRegion
  }
  /**
   * @private
   * @type {EyesWrappedElement<TElement, TSelector>}
   */
  getTargetElement() {
    return this._targetElement
  }
  /**
   * @param {FrameReference<TElement, TSelector>} reference - the frame to switch to
   * @return {this}
   */
  frame(reference) {
    if (this.spec.isContext(reference)) {
      this._context = {reference, parent: this._context}
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @private
   * @type {Frame<TElement, TSelector>[]}
   */
  getContext() {
    return this._context
  }
  /**
   * Adds a region to ignore
   * @param {RegionReference<TElement, TSelector>} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignoreRegion(region) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({region: new Region(region)})
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({selector: region})
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({element: region})
    } else {
      throw new TypeError('Method "ignoreRegion" called with argument of unknown type!')
    }
    this._ignoreRegions.push(fluentRegion)

    return this
  }
  /**
   * Adds a region to ignore
   * @param {RegionReference<TElement, TSelector>} region - region reference to ignore when validating the screenshot
   * @return {this} this instance for chaining
   */
  ignore(region) {
    return this.ignoreRegion(region)
  }
  /**
   * Adds one or more ignore regions.
   * @param {RegionReference<TElement, TSelector>[]} regions - region references to ignore when validating the screenshot.
   * @return {this} this instance of the settings object.
   */
  ignoreRegions(...regions) {
    regions.forEach(region => this.ignoreRegion(region))
    return this
  }
  /**
   * Adds one or more ignore regions.
   * @param {RegionReference<TElement, TSelector>[]} regions - region references to ignore when validating the screenshot.
   * @return {this} this instance of the settings object.
   */
  ignores(...regions) {
    return this.ignoreRegions(...regions)
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getIgnoreRegions() {
    return this._ignoreRegions
  }
  /**
   * Adds a layout region
   * @param {RegionReference<TElement, TSelector>} region - region reference to match as layout when validating the screenshot
   * @return {this} this instance for chaining
   */
  layoutRegion(region) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({region: new Region(region)})
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({selector: region})
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({element: region})
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._layoutRegions.push(fluentRegion)

    return this
  }
  /**
   * Adds one or more layout regions.
   * @param {RegionReference<TElement, TSelector>[]} regions - region references to match using the Layout method.
   * @return {this} this instance of the settings object.
   */
  layoutRegions(...regions) {
    regions.forEach(region => this.layoutRegion(region))
    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getLayoutRegions() {
    return this._layoutRegions
  }
  /**
   * Adds a strict region
   * @param {RegionReference<TElement, TSelector>} region - region reference to match as strict when validating the screenshot
   * @return {this} this instance for chaining
   */
  strictRegion(region) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({region: new Region(region)})
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({selector: region})
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({element: region})
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._strictRegions.push(fluentRegion)

    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getStrictRegions() {
    return this._strictRegions
  }
  /**
   * Adds one or more strict regions.
   * @param {RegionReference<TElement, TSelector>[]} regions - region references to match using the Strict method.
   * @return {this} this instance of the settings object.
   */
  strictRegions(...regions) {
    regions.forEach(region => this.strictRegion(region))
    return this
  }
  /**
   * Adds a content region
   * @param {RegionReference<TElement, TSelector>} region - region reference to match as content when validating the screenshot
   * @return {this} this instance for chaining
   */
  contentRegion(region) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({region: new Region(region)})
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({selector: region})
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({element: region})
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._contentRegions.push(fluentRegion)

    return this
  }
  /**
   * Adds one or more content regions.
   * @param {RegionReference<TElement, TSelector>[]} regions - region references to match using the Content method.
   * @return {this} this instance of the settings object.
   */
  contentRegions(...regions) {
    regions.forEach(region => this.contentRegion(region))
    return this
  }
  /**
   * @private
   * @return {GetRegion[]}
   */
  getContentRegions() {
    return this._contentRegions
  }
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference<TElement, TSelector>} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (region instanceof FloatingMatchSettings) {
      fluentRegion = new FluentRegion({
        region: region.getRegion(),
        options: {
          maxUpOffset: region.getMaxUpOffset(),
          maxDownOffset: region.getMaxDownOffset(),
          maxLeftOffset: region.getMaxLeftOffset(),
          maxRightOffset: region.getMaxRightOffset(),
        },
      })
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({
        region: new Region(region),
        options: {maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      })
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({
        selector: region,
        options: {maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      })
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({
        element: region,
        options: {maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset},
      })
    } else {
      throw new TypeError('Method "floatingRegion" called with argument of unknown type!')
    }
    this._floatingRegions.push(fluentRegion)

    return this
  }
  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries
   * of a bigger region
   * @param {RegionReference<TElement, TSelector>} region - region reference to mark as float when validating the screenshot
   * @param {number} [maxUpOffset] - how much the content can move up
   * @param {number} [maxDownOffset] - how much the content can move down
   * @param {number} [maxLeftOffset] - how much the content can move to the left
   * @param {number} [maxRightOffset] - how much the content can move to the right
   * @return {this} this instance for chaining
   */
  floating(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
  }
  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries
   * of a bigger region.
   * @param {number} maxOffset - how much each of the content rectangles can move in any direction.
   * @param {RegionReference<TElement, TSelector>[]} regions - one or more content rectangles or region containers
   * @return {this} this instance of the settings object.
   */
  floatingRegions(maxOffset, ...regions) {
    regions.forEach(region =>
      this.floatingRegion(region, maxOffset, maxOffset, maxOffset, maxOffset),
    )
    return this
  }
  /**
   * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries
   * of a bigger region.
   * @param {number} maxOffset - how much each of the content rectangles can move in any direction.
   * @param {RegionReference<TElement, TSelector>[]} regions - one or more content rectangles or region containers
   * @return {this} this instance of the settings object.
   */
  floatings(maxOffset, ...regions) {
    return this.floatingRegions(maxOffset, ...regions)
  }
  /**
   * @private
   * @return {GetFloatingRegion[]}
   */
  getFloatingRegions() {
    return this._floatingRegions
  }
  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference<TElement, TSelector>} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [accessibilityType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibilityRegion(region, accessibilityType) {
    let fluentRegion
    if (region instanceof FluentRegion) {
      fluentRegion = region
    } else if (region instanceof AccessibilityMatchSettings) {
      fluentRegion = new FluentRegion({
        region: region.getRegion(),
        options: {accessibilityType: region.getType(), type: region.getType()},
      })
    } else if (Region.isRegionCompatible(region)) {
      fluentRegion = new FluentRegion({
        region: new Region(region),
        options: {accessibilityType, type: accessibilityType},
      })
    } else if (this.spec.isSelector(region)) {
      fluentRegion = new FluentRegion({
        selector: region,
        options: {accessibilityType, type: accessibilityType},
      })
    } else if (this.spec.isElement(region)) {
      fluentRegion = new FluentRegion({
        element: region,
        options: {accessibilityType, type: accessibilityType},
      })
    } else {
      throw new TypeError('Method called with argument of unknown type!')
    }
    this._accessibilityRegions.push(fluentRegion)

    return this
  }
  /**
   * Adds an accessibility region. An accessibility region is a region that has an accessibility type
   * @param {RegionReference<TElement, TSelector>} region - region reference of content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - type of accessibility
   * @return {this} this instance for chaining
   */
  accessibility(region, regionType) {
    return this.accessibilityRegion(region, regionType)
  }
  /**
   * @private
   * @return {GetAccessibilityRegion[]}
   */
  getAccessibilityRegions() {
    return this._accessibilityRegions
  }
  /**
   * @param {ElementReference<TElement, TSelector>} element
   * @return {this}
   */
  scrollRootElement(scrollRootElement) {
    if (this.spec.isSelector(scrollRootElement) || this.spec.isElement(scrollRootElement)) {
      if (this._context) {
        this._context.scrollRootElement = scrollRootElement
      } else {
        this._scrollRootElement = scrollRootElement
      }
    } else {
      throw new TypeError('scrollRootElement method called with argument of unknown type!')
    }
    return this
  }
  /**
   * @private
   * @return {Promise<EyesWrappedElement<TElement, TSelector>>}
   */
  getScrollRootElement() {
    return this._scrollRootElement
  }
  /**
   * A setter for the checkpoint name.
   * @param {string} name - A name by which to identify the checkpoint.
   * @return {this} - This instance of the settings object.
   */
  withName(name) {
    this._name = name
    return this
  }
  /**
   * @private
   * @return {string}
   */
  getName() {
    return this._name
  }
  /**
   * Defines whether to send the document DOM or not.
   * @param {boolean} [sendDom=true] - When {@code true} sends the DOM to the server (the default).
   * @return {this} - This instance of the settings object.
   */
  sendDom(sendDom = true) {
    this._sendDom = sendDom
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom
  }
  /**
   * Set the render ID of the screenshot.
   * @param {string} renderId - The render ID to use.
   * @return {this} - This instance of the settings object.
   */
  renderId(renderId) {
    this._renderId = renderId
    return this
  }
  /**
   * @private
   * @return {string}
   */
  getRenderId() {
    return this._renderId
  }
  /**
   * Set the match level by which to compare the screenshot.
   * @param {MatchLevel} matchLevel - The match level to use.
   * @return {this} - This instance of the settings object.
   */
  matchLevel(matchLevel) {
    this._matchLevel = matchLevel
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
   * @return {this} - This instance of the settings object.
   */
  layout() {
    this._matchLevel = MatchLevel.Layout
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.EXACT}.
   * @return {this} - This instance of the settings object.
   */
  exact() {
    this._matchLevel = MatchLevel.Exact
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.STRICT}.
   * @return {this} - This instance of the settings object.
   */
  strict() {
    this._matchLevel = MatchLevel.Strict
    return this
  }
  /**
   * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
   * @return {this} - This instance of the settings object.
   */
  content() {
    this._matchLevel = MatchLevel.Content
    return this
  }
  /**
   * @private
   * @return {MatchLevel}
   */
  getMatchLevel() {
    return this._matchLevel
  }
  /**
   * Defines if to detect and ignore a blinking caret in the screenshot.
   * @param {boolean} [ignoreCaret=true] - Whether or not to detect and ignore a blinking caret in the screenshot.
   * @return {this} - This instance of the settings object.
   */
  ignoreCaret(ignoreCaret = true) {
    this._ignoreCaret = ignoreCaret
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getIgnoreCaret() {
    return this._ignoreCaret
  }
  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
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
   * @private
   * @return {boolean}
   */
  getStitchContent() {
    return this._stitchContent
  }
  /**
   * Defines useDom for enabling the match algorithm to use dom.
   * @param {boolean} [useDom=true]
   * @return {this} - This instance of the settings object.
   */
  useDom(useDom = true) {
    this._useDom = useDom
    return this
  }
  /**
   * @private
   * @return {boolean}
   */
  getUseDom() {
    return this._useDom
  }
  /**
   * Enabling the match algorithms for pattern detection
   * @param {boolean} [enablePatterns=true]
   * @return {this} - This instance of the settings object.
   */
  enablePatterns(enablePatterns = true) {
    this._enablePatterns = enablePatterns
    return this
  }
  /**
   * @private
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
   * @private
   * @return {boolean}
   */
  getIgnoreDisplacements() {
    return this._ignoreDisplacements
  }
  /**
   * Defines the timeout to use when acquiring and comparing screenshots.
   * @param {number} timeoutMilliseconds - The timeout to use in milliseconds.
   * @return {this} - This instance of the settings object.
   */
  timeout(timeoutMilliseconds = -1) {
    this._timeout = timeoutMilliseconds
    return this
  }
  /**
   * @private
   * @return {number}
   */
  getTimeout() {
    return this._timeout
  }
  /**
   * @param {string} name
   * @param {string} script
   * @return {this}
   */
  hook(name, script) {
    this._scriptHooks[name] = script
    return this
  }
  /**
   * @param {String} hook
   * @return {this}
   */
  beforeRenderScreenshotHook(hook) {
    return this.hook(BEFORE_CAPTURE_SCREENSHOT, hook)
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
   * @private
   * @return {Map<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks
  }
  visualGridOption(key, value) {
    if (!this._visualGridOptions) {
      this._visualGridOptions = {}
    }
    this._visualGridOptions[key] = value
    return this
  }
  visualGridOptions(options) {
    this._visualGridOptions = options
    return this
  }
  getVisualGridOptions() {
    return this._visualGridOptions
  }
  layoutBreakpoints(breakpoints = true) {
    if (!TypeUtils.isArray(breakpoints)) {
      this._layoutBreakpoints = breakpoints
    } else if (breakpoints.length === 0) {
      this._layoutBreakpoints = false
    } else {
      this._layoutBreakpoints = Array.from(new Set(breakpoints)).sort((a, b) => (a < b ? 1 : -1))
    }
    return this
  }
  getLayoutBreakpoints() {
    return this._layoutBreakpoints
  }
  disableBrowserFetching(value = true) {
    this._disableBrowserFetching = value
    return this
  }
  getDisableBrowserFetching() {
    return this._disableBrowserFetching
  }

  /**
   * @override
   */
  toString() {
    return `${this.constructor.name} ${GeneralUtils.toString(this)}`
  }
}

module.exports = CheckSettings
