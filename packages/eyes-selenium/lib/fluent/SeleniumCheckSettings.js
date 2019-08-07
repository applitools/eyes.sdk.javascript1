'use strict';

const { WebElement, By } = require('selenium-webdriver');
const { TypeUtils, Region } = require('@applitools/eyes-common');
const { CheckSettings } = require('@applitools/eyes-sdk-core');

const { IgnoreRegionBySelector } = require('./IgnoreRegionBySelector');
const { IgnoreRegionByElement } = require('./IgnoreRegionByElement');
const { FloatingRegionBySelector } = require('./FloatingRegionBySelector');
const { FloatingRegionByElement } = require('./FloatingRegionByElement');
const { SelectorByElement } = require('./SelectorByElement');
const { SelectorByLocator } = require('./SelectorByLocator');
const { FrameLocator } = require('./FrameLocator');
const { EyesWebElement } = require('../wrappers/EyesWebElement');

const BEFORE_CAPTURE_SCREENSHOT = 'beforeCaptureScreenshot';

class SeleniumCheckSettings extends CheckSettings {
  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement|string} [region]
   * @param {number|string|By|WebElement|EyesWebElement} [frame]
   */
  constructor(region, frame) {
    super();

    this._targetSelector = null;
    this._targetElement = null;
    this._frameChain = [];

    /** @type {By} */
    this._scrollRootSelector = undefined;
    /** @type {WebElement} */
    this._scrollRootElement = undefined;

    if (region) {
      this.region(region);
    }

    if (frame) {
      this.frame(frame);
    }

    /** @type {Object<string, string>} */ this._scriptHooks = {};
  }

  /**
   * @package
   * @ignore
   * @return {?GetSelector}
   */
  getTargetProvider() {
    if (this._targetSelector) {
      return new SelectorByLocator(this._targetSelector);
    }

    if (this._targetElement) {
      return new SelectorByElement(this._targetElement);
    }

    return undefined;
  }

  /**
   * @package
   * @ignore
   * @return {By}
   */
  getTargetSelector() {
    return this._targetSelector;
  }

  /**
   * @package
   * @ignore
   * @return {WebElement}
   */
  getTargetElement() {
    return this._targetElement;
  }

  /**
   * @package
   * @ignore
   * @return {FrameLocator[]}
   */
  getFrameChain() {
    return this._frameChain;
  }

  /**
   * @param {number|string|By|WebElement|EyesWebElement} frame - The frame to switch to.
   * @return {this}
   */
  frame(frame) {
    const fl = new FrameLocator();
    // noinspection IfStatementWithTooManyBranchesJS
    if (TypeUtils.isInteger(frame)) {
      fl.setFrameIndex(frame);
    } else if (TypeUtils.isString(frame)) {
      fl.setFrameNameOrId(frame);
    } else if (EyesWebElement.isLocator(frame)) {
      fl.setFrameSelector(frame);
    } else if (frame instanceof WebElement) {
      fl.setFrameElement(frame);
    } else {
      throw new TypeError('frame method called with argument of unknown type!');
    }
    this._frameChain.push(fl);
    return this;
  }

  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement|string} region - The region to validate.
   * @return {this}
   */
  region(region) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (Region.isRegionCompatible(region)) {
      super.updateTargetRegion(region);
    } else if (TypeUtils.isString(region)) {
      this._targetSelector = By.css(region); // TODO: avoid converting to element for VisualGrid
    } else if (EyesWebElement.isLocator(region)) {
      this._targetSelector = region;
    } else if (region instanceof WebElement) {
      this._targetElement = region;
    } else {
      throw new TypeError('region method called with argument of unknown type!');
    }
    return this;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @inheritDoc
   * @protected
   * @param {By|WebElement|EyesWebElement|GetRegion|Region} region
   */
  _regionToRegionProvider(region) {
    if (EyesWebElement.isLocator(region)) {
      return new IgnoreRegionBySelector(region);
    }

    if (region instanceof WebElement) {
      return new IgnoreRegionByElement(region);
    }

    return super._regionToRegionProvider(region);
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to ignore when validating.
   * @return {this}
   */
  ignoreRegions(...regions) {
    // noinspection JSValidateTypes
    return super.ignoreRegions(...regions);
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to match using the Layout method.
   * @return {this}
   */
  layoutRegions(...regions) {
    // noinspection JSValidateTypes
    return super.layoutRegions(...regions);
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to match using the Strict method.
   * @return {this}
   */
  strictRegions(...regions) {
    // noinspection JSValidateTypes
    return super.strictRegions(...regions);
  }

  /**
   * @inheritDoc
   * @param {...(By|WebElement|EyesWebElement|GetRegion|Region)} regions - A region to match using the Content method.
   * @return {this}
   */
  contentRegions(...regions) {
    // noinspection JSValidateTypes
    return super.contentRegions(...regions);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|WebElement|EyesWebElement} regionOrContainer - The content
   *   rectangle or region container
   * @param {number} [maxUpOffset] - How much the content can move up.
   * @param {number} [maxDownOffset] - How much the content can move down.
   * @param {number} [maxLeftOffset] - How much the content can move to the left.
   * @param {number} [maxRightOffset] - How much the content can move to the right.
   * @return {this}
   */
  floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (EyesWebElement.isLocator(regionOrContainer)) {
      const floatingRegion = new FloatingRegionBySelector(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset
      );
      this._floatingRegions.push(floatingRegion);
    } else if (regionOrContainer instanceof WebElement) {
      const floatingRegion = new FloatingRegionByElement(
        regionOrContainer,
        maxUpOffset,
        maxDownOffset,
        maxLeftOffset,
        maxRightOffset
      );
      this._floatingRegions.push(floatingRegion);
    } else {
      super.floatingRegion(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    }
    return this;
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * @inheritDoc
   * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
   * @param {...(GetFloatingRegion|Region|By|WebElement|EyesWebElement)} regionsOrContainers - One or more content
   *   rectangles or region containers
   * @return {this}
   */
  floatingRegions(maxOffset, ...regionsOrContainers) {
    return super.floatingRegions(maxOffset, ...regionsOrContainers);
  }

  /**
   * @ignore
   * @return {string}
   */
  getSizeMode() {
    if (!this._targetRegion && !this._targetElement && !this._targetSelector) {
      if (this.getStitchContent()) {
        return 'full-page';
      }
      return 'viewport';
    } if (this._targetRegion) {
      if (this.getStitchContent()) {
        return 'region';
      }
      return 'region';
    }
    if (this.getStitchContent()) {
      return 'selector';
    }
    return 'selector';
  }

  /**
   * @param {By|WebElement|EyesWebElement} element
   * @return {this}
   */
  scrollRootElement(element) {
    if (EyesWebElement.isLocator(element)) {
      if (this._frameChain.length === 0) {
        this._scrollRootSelector = element;
      } else {
        this._frameChain[this._frameChain.length - 1].setScrollRootSelector(element);
      }
    } else if (this._frameChain.length === 0) {
      this._scrollRootElement = element;
    } else {
      this._frameChain[this._frameChain.length - 1].setScrollRootElement(element);
    }

    return this;
  }

  /**
   * @ignore
   * @return {Promise<WebElement>}
   */
  async getScrollRootElement() {
    return this._scrollRootElement;
  }

  /**
   * @ignore
   * @return {By}
   */
  getScrollRootSelector() {
    return this._scrollRootSelector;
  }

  /**
   * @deprecated
   * @param {String} hook
   * @return {this}
   */
  webHook(hook) {
    return this.beforeRenderScreenshotHook(hook);
  }

  /**
   * @param {String} hook
   * @return {this}
   */
  beforeRenderScreenshotHook(hook) {
    this._scriptHooks[BEFORE_CAPTURE_SCREENSHOT] = hook;
    return this;
  }

  /**
   * @ignore
   * @return {Object<string, string>}
   */
  getScriptHooks() {
    return this._scriptHooks;
  }
}

exports.SeleniumCheckSettings = SeleniumCheckSettings;
