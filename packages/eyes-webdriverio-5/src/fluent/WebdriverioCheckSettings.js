'use strict'

const {CheckSettings, Region, TypeUtils} = require('@applitools/eyes-sdk-core')
const {By} = require('selenium-webdriver') // TODO: remove usage
const WebElement = require('../wrappers/WebElement')
const EyesWebElement = require('../wrappers/EyesWebElement')
const FrameLocator = require('./FrameLocator')
const IgnoreRegionBySelector = require('./IgnoreRegionBySelector')
const IgnoreRegionByElement = require('./IgnoreRegionByElement')
const {SelectorByElement} = require('./SelectorByElement')
const {SelectorByLocator} = require('./SelectorByLocator')
const FloatingRegionBySelector = require('./FloatingRegionBySelector')
const FloatingRegionByElement = require('./FloatingRegionByElement')
const AccessibilityRegionBySelector = require('./AccessibilityRegionBySelector')
const AccessibilityRegionByElement = require('./AccessibilityRegionByElement')

const USE_DEFAULT_MATCH_TIMEOUT = -1
const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot'

class WebdriverioCheckSettings extends CheckSettings {
  /**
   *
   * @param {Region|By|WebElement|EyesWebElement} [region]
   * @param {int|String|By} [frame]
   */
  constructor(region, frame) {
    super()

    /** @type {By} */
    this._targetSelector = null
    /** @type {WebElement} */
    this._targetElement = null
    this._frameChain = []

    if (region) {
      this.region(region)
    }

    if (frame) {
      this.frame(frame)
    }

    /** @type {Map<string, string>} */ this._scriptHooks = new Map()
  }

  /**
   * @package
   * @ignore
   * @return {?GetSelector}
   */
  getTargetProvider() {
    if (this._targetSelector) {
      return new SelectorByLocator(this._targetSelector)
    }

    if (this._targetElement) {
      return new SelectorByElement(this._targetElement)
    }

    return undefined
  }

  /**
   *
   * @param {Region|By|WebElement|string} region
   * @returns {WebdriverioCheckSettings}
   */
  region(region) {
    if (Region.isRegionCompatible(region)) {
      super.updateTargetRegion(region)
    } else if (region instanceof By) {
      this._targetSelector = region
    } else if (region instanceof WebElement) {
      this._targetElement = region
    } else if (TypeUtils.isString(region)) {
      this._targetSelector = By.css(region)
    } else {
      throw new TypeError('region method called with argument of unknown type!')
    }
    return this
  }

  /**
   * @param {Integer|String|By|WebElement|EyesWebElement} frame The frame to switch to.
   * @returns {WebdriverioCheckSettings}
   */
  frame(frame) {
    const fl = new FrameLocator()

    if (TypeUtils.isInteger(frame)) {
      fl.setFrameIndex(frame)
    } else if (TypeUtils.isString(frame)) {
      fl.setFrameNameOrId(frame)
    } else if (frame instanceof By) {
      fl.setFrameSelector(frame)
    } else if (frame instanceof WebElement) {
      fl.setFrameElement(frame)
    } else {
      throw new TypeError('frame method called with argument of unknown type!')
    }
    this._frameChain.push(fl)
    return this
  }

  /**
   * Adds a region to ignore.
   *
   * @override
   * @param {GetRegion|Region|By|WebElement|EyesWebElement} regionOrContainer The region or region container to ignore when validating the screenshot.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  ignore(regionOrContainer) {
    if (regionOrContainer instanceof By) {
      this._ignoreRegions.push(new IgnoreRegionBySelector(regionOrContainer))
    } else if (regionOrContainer instanceof WebElement) {
      this._ignoreRegions.push(new IgnoreRegionByElement(regionOrContainer))
    } else {
      super.ignoreRegions(regionOrContainer)
    }

    return this
  }

  /**
   * Adds one or more ignore regions.
   *
   * @override
   * @param {...(GetRegion|Region|By|WebElement|EyesWebElement)} regionsOrContainers - One or more regions or region containers to ignore when validating the screenshot.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  ignores(...regionsOrContainers) {
    super.ignoreRegions(...regionsOrContainers)
    return this
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to ignore when validating.
   * @return {this}
   */
  ignoreRegions(...regions) {
    return super.ignoreRegions(...regions)
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to match using the Layout method.
   * @return {this}
   */
  layoutRegions(...regions) {
    return super.layoutRegions(...regions)
  }

  /**
   * @inheritDoc
   * @protected
   * @param {By|WebElement|EyesWebElement|GetRegion|Region} region
   */
  _regionToRegionProvider(region) {
    if (EyesWebElement.isLocator(region)) {
      return new IgnoreRegionBySelector(region)
    }

    if (region instanceof WebElement) {
      return new IgnoreRegionByElement(region)
    }

    return super._regionToRegionProvider(region)
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|WebElement|EyesWebElement} regionOrContainer The content rectangle or region container
   * @param {int} [maxUpOffset] How much the content can move up.
   * @param {int} [maxDownOffset] How much the content can move down.
   * @param {int} [maxLeftOffset] How much the content can move to the left.
   * @param {int} [maxRightOffset] How much the content can move to the right.
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  floating(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (regionOrContainer instanceof By) {
      this._floatingRegions.push(
        new FloatingRegionBySelector(
          regionOrContainer,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        ),
      )
    } else if (regionOrContainer instanceof WebElement) {
      this._floatingRegions.push(
        new FloatingRegionByElement(
          regionOrContainer,
          maxUpOffset,
          maxDownOffset,
          maxLeftOffset,
          maxRightOffset,
        ),
      )
    } else {
      super.floatingRegion(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset,
      )
    }
    return this
  }

  /**
   * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {int} maxOffset How much each of the content rectangles can move in any direction.
   * @param {...(GetFloatingRegion|Region|By|WebElement|EyesWebElement)} regionsOrContainers One or more content rectangles or region containers
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  floatings(maxOffset, ...regionsOrContainers) {
    super.floatings(maxOffset, ...regionsOrContainers)
    return this
  }

  /**
   * @inheritDoc
   * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings|By|WebElement|EyesWebElement} regionOrContainer - The content rectangle or region container
   * @param {AccessibilityRegionType} [regionType] - Type of accessibility.
   * @return {this}
   */
  accessibilityRegion(regionOrContainer, regionType) {
    if (regionOrContainer instanceof By) {
      const accessibilityRegion = new AccessibilityRegionBySelector(regionOrContainer, regionType)
      this._accessibilityRegions.push(accessibilityRegion)
    } else if (regionOrContainer instanceof WebElement) {
      const floatingRegion = new AccessibilityRegionByElement(regionOrContainer, regionType)
      this._accessibilityRegions.push(floatingRegion)
    } else {
      super.accessibilityRegion(regionOrContainer, regionType)
    }
    return this
  }

  /**
   *
   * @param {number} [timeoutMilliseconds]
   * @returns {WebdriverioCheckSettings}
   */
  timeout(timeoutMilliseconds = USE_DEFAULT_MATCH_TIMEOUT) {
    super.timeout(timeoutMilliseconds)
    return this
  }

  /**
   * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
   *
   * @override
   * @param {boolean} [fully]
   * @return {WebdriverioCheckSettings} This instance of the settings object.
   */
  fully(fully) {
    super.fully(fully)
    return this
  }

  /**
   * @override
   * @param {Boolean} [stitchContent=true]
   * @return {WebdriverioCheckSettings}
   */
  stitchContent(stitchContent = true) {
    super.stitchContent(stitchContent)
    return this
  }

  /**
   * @returns {By}
   */
  get targetSelector() {
    return this._targetSelector
  }

  /**
   * @returns {WebElement}
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
   * @param {By|WebElement|EyesWebElement} element
   * @return {this}
   */
  scrollRootElement(element) {
    if (EyesWebElement.isLocator(element)) {
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
   * @return {Promise<WebElement>}
   */
  async getScrollRootElement() {
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
  /**
   * @param {...TBDTYPE} regions
   */
  strictRegions(...regions) {
    regions.forEach(region => {
      this._processStrictRegions(region)
    })
    return this
  }
  /**
   * @param {...TBDTYPE} regions
   */
  layoutRegions(...regions) {
    regions.forEach(region => {
      this._processLayoutRegions(region)
    })
    return this
  }
  /**
   * @param {...TBDTYPE} regions
   */
  contentRegions(...regions) {
    regions.forEach(region => {
      this._processContentRegions(region)
    })
    return this
  }
  /*
   * @private
   */
  _processStrictRegions(regionOrContainer) {
    if (regionOrContainer instanceof By) {
      this._strictRegions.push(new IgnoreRegionBySelector(regionOrContainer))
    } else if (regionOrContainer instanceof WebElement) {
      this._strictRegions.push(new IgnoreRegionByElement(regionOrContainer))
    } else {
      super.strictRegions(regionOrContainer)
    }
  }
  /*
   * @private
   */
  _processLayoutRegions(regionOrContainer) {
    if (regionOrContainer instanceof By) {
      this._layoutRegions.push(new IgnoreRegionBySelector(regionOrContainer))
    } else if (regionOrContainer instanceof WebElement) {
      this._layoutRegions.push(new IgnoreRegionByElement(regionOrContainer))
    } else {
      super.layoutRegions(regionOrContainer)
    }
  }
  /*
   * @private
   */
  _processContentRegions(regionOrContainer) {
    if (regionOrContainer instanceof By) {
      this._contentRegions.push(new IgnoreRegionBySelector(regionOrContainer))
    } else if (regionOrContainer instanceof WebElement) {
      this._contentRegions.push(new IgnoreRegionByElement(regionOrContainer))
    } else {
      super.contentRegions(regionOrContainer)
    }
  }
}

module.exports = WebdriverioCheckSettings
