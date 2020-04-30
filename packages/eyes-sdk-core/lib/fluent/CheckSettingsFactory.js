'use strict'

const {TypeUtils, Region} = require('@applitools/eyes-common')

const CheckSettings = require('./CheckSettings')
const FrameLocator = require('./FrameLocator')
const TargetRegionBySelector = require('./TargetRegionBySelector')
const TargetRegionByElement = require('./TargetRegionByElement')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

function CheckSettingsFactory(WrappedElement, ElementFinder) {
  return class DriverCheckSettings extends CheckSettings {
    /**
     *
     * @param {Region|By|String|WrappedElement} [region]
     * @param {Integer|String|By|WrappedElement} [frame]
     */
    constructor(region, frame) {
      super()
      /** @type {?} */
      this._targetSelector = null
      /** @type {EyesWrappedElement} */
      this._targetElement = null
      this._frameChain = []

      if (region) {
        this.region(region)
      }
      if (frame) {
        this.frame(frame)
      }
    }

    static window() {
      return new DriverCheckSettings()
    }

    static region(region, frame) {
      return new DriverCheckSettings(region, frame)
    }

    static frame(frame) {
      return new DriverCheckSettings(null, frame)
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
      if (ElementFinder.isLocator(region)) {
        ignoreRegion = new IgnoreRegionBySelector(region)
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        ignoreRegion = new IgnoreRegionByElement(WrappedElement.partial(region))
      } else {
        return super.ignoreRegion(region)
      }
      this._ignoreRegions.push(ignoreRegion)

      return this
    }

    layoutRegion(region) {
      let layoutRegion
      if (ElementFinder.isLocator(region)) {
        layoutRegion = new IgnoreRegionBySelector(region)
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        layoutRegion = new IgnoreRegionByElement(WrappedElement.partial(region))
      } else {
        return super.layoutRegion(region)
      }
      this._layoutRegions.push(layoutRegion)

      return this
    }

    strictRegion(region) {
      let strictRegion
      if (ElementFinder.isLocator(region)) {
        strictRegion = new IgnoreRegionBySelector(region)
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        strictRegion = new IgnoreRegionByElement(WrappedElement.partial(region))
      } else {
        return super.strictRegion(region)
      }
      this._strictRegions.push(strictRegion)

      return this
    }

    contentRegion(region) {
      let contentRegion
      if (ElementFinder.isLocator(region)) {
        contentRegion = new IgnoreRegionBySelector(region)
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        contentRegion = new IgnoreRegionByElement(WrappedElement.partial(region))
      } else {
        return super.contentRegion(region)
      }
      this._contentRegions.push(contentRegion)

      return this
    }

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
    floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
      let floatingRegion
      if (ElementFinder.isLocator(region)) {
        floatingRegion = new FloatingRegionBySelector(
          region,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        )
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        floatingRegion = new FloatingRegionByElement(
          WrappedElement.partial(region),
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        )
      } else {
        return super.floatingRegion(
          region,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        )
      }
      this._floatingRegions.push(floatingRegion)

      return this
    }

    /**
     * Adds an accessibility region. An accessibility region is a region that has an accessibility type.
     *
     * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings} regionOrContainer - The content rectangle or
     *   region container
     * @param {AccessibilityRegionType} [regionType] - Type of accessibility.
     * @return {this} - This instance of the settings object.
     */
    accessibilityRegion(region, regionType) {
      let accessibilityRegion
      if (ElementFinder.isLocator(region)) {
        accessibilityRegion = new AccessibilityRegionBySelector(region, regionType)
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        accessibilityRegion = new AccessibilityRegionByElement(
          WrappedElement.partial(region),
          regionType,
        )
      } else {
        return super.accessibilityRegion(region, regionType)
      }
      this._accessibilityRegions.push(accessibilityRegion)

      return this
    }

    /**
     *
     * @param {Region|By|String|WrappedElement} region
     * @returns {WebdriverioCheckSettings}
     */
    region(region) {
      if (Region.isRegionCompatible(region)) {
        this._targetRegion = new Region(region)
      } else if (ElementFinder.isLocator(region)) {
        this._targetSelector = region
      } else if (region instanceof WrappedElement || WrappedElement.isCompatible(region)) {
        this._targetElement = WrappedElement.partial(region)
      } else {
        throw new TypeError('region method called with argument of unknown type!')
      }
      return this
    }

    /**
     * @param {Integer|String|By|WrappedElement} frame The frame to switch to.
     * @returns {WebdriverioCheckSettings}
     */
    frame(frame) {
      const fl = new FrameLocator()

      if (TypeUtils.isInteger(frame)) {
        fl.setFrameIndex(frame)
      } else if (TypeUtils.isString(frame)) {
        fl.setFrameNameOrId(frame)
      } else if (ElementFinder.isLocator(frame)) {
        fl.setFrameSelector(frame)
      } else if (frame instanceof WrappedElement || WrappedElement.isCompatible(frame)) {
        fl.setFrameElement(WrappedElement.partial(frame))
      } else {
        throw new TypeError('frame method called with argument of unknown type!')
      }
      this._frameChain.push(fl)
      return this
    }

    /**
     * @package
     * @ignore
     * @return {?GetSelector}
     */
    getTargetProvider() {
      if (this._targetSelector) {
        return new TargetRegionBySelector(this._targetSelector)
      } else if (this._targetElement) {
        return new TargetRegionByElement(WrappedElement.partial(this._targetElement))
      }
    }

    /**
     * @returns {By}
     */
    get targetSelector() {
      return this._targetSelector
    }

    /**
     * @returns {WrappedElement|Object}
     */
    get targetElement() {
      return this._targetElement
    }

    /**
     * @returns {FrameLocator[]}
     */
    getFrameChain() {
      return this._frameChain
    }

    _getTargetType() {
      return !this._targetRegion && !this._targetElement && !this._targetSelector
        ? 'window'
        : 'region'
    }

    /**
     * @param {By|String|WrappedElement|Object} element
     * @return {this}
     */
    scrollRootElement(element) {
      if (ElementFinder.isLocator(element)) {
        if (this._frameChain.length === 0) {
          this._scrollRootSelector = element
        } else {
          this._frameChain[this._frameChain.length - 1].setScrollRootSelector(element)
        }
      } else if (this._frameChain.length === 0) {
        this._scrollRootElement = element
      } else {
        this._frameChain[this._frameChain.length - 1].setScrollRootElement(element)
      }

      return this
    }

    /**
     * @ignore
     * @return {Promise<WrappedElement>}
     */
    getScrollRootElement() {
      return this._scrollRootElement
    }

    /**
     * @ignore
     * @return {By}
     */
    getScrollRootSelector() {
      return this._scrollRootSelector
    }

    /**
     * @param {string} script
     */
    addScriptHook(script) {
      let scripts = this._scriptHooks.get(BEFORE_CAPTURE_SCREENSHOT)
      if (scripts == null) {
        scripts = []
        this._scriptHooks.set(BEFORE_CAPTURE_SCREENSHOT, scripts)
      }
      scripts.add(script)
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
}

module.exports = CheckSettingsFactory
