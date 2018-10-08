'use strict';

const { By, WebElement } = require('selenium-webdriver');
const { GeneralUtils, CheckSettings, Region } = require('@applitools/eyes.sdk.core');

const { IgnoreRegionBySelector } = require('./IgnoreRegionBySelector');
const { IgnoreRegionByElement } = require('./IgnoreRegionByElement');
const { FloatingRegionBySelector } = require('./FloatingRegionBySelector');
const { FloatingRegionByElement } = require('./FloatingRegionByElement');
const { FrameLocator } = require('./FrameLocator');

/**
 * @return {boolean}
 */
const isProtractorBy = value => Object.prototype.hasOwnProperty.call(value, 'using') &&
  Object.prototype.hasOwnProperty.call(value, 'value');

class SeleniumCheckSettings extends CheckSettings {
  /**
   * @param {Region|RegionObject|By|WebElement|EyesWebElement} [region]
   * @param {Integer|string|By|WebElement|EyesWebElement} [frame]
   */
  constructor(region, frame) {
    super();

    this._targetSelector = null;
    this._targetElement = null;
    this._frameChain = [];

    if (region) {
      this.region(region);
    }

    if (frame) {
      this.frame(frame);
    }
  }

  /**
   * @return {By}
   */
  getTargetSelector() {
    return this._targetSelector;
  }

  /**
   * @return {WebElement}
   */
  getTargetElement() {
    return this._targetElement;
  }

  /**
   * @return {FrameLocator[]}
   */
  getFrameChain() {
    return this._frameChain;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  layout() {
    super.layout();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  exact() {
    super.exact();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  strict() {
    super.strict();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  content() {
    super.content();
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  matchLevel(matchLevel) {
    super.matchLevel(matchLevel);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  ignoreCaret(ignoreCaret) {
    super.ignoreCaret(ignoreCaret);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  fully(fully) {
    super.fully(fully);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  stitchContent(stitchContent) {
    super.stitchContent(stitchContent);
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  /** @inheritDoc */
  timeout(timeoutMilliseconds) {
    super.timeout(timeoutMilliseconds);
    return this;
  }

  /**
   * @param {Integer|string|By|WebElement|EyesWebElement} frame The frame to switch to.
   * @return {SeleniumCheckSettings}
   */
  frame(frame) {
    const fl = new FrameLocator();
    // noinspection IfStatementWithTooManyBranchesJS
    if (Number.isInteger(frame)) {
      fl.setFrameIndex(frame);
    } else if (GeneralUtils.isString(frame)) {
      fl.setFrameNameOrId(frame);
    } else if (frame instanceof By || isProtractorBy(frame)) {
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
   * @param {Region|RegionObject|By|WebElement|EyesWebElement} region The region to validate.
   * @return {SeleniumCheckSettings}
   */
  region(region) {
    // noinspection IfStatementWithTooManyBranchesJS
    if (region instanceof Region) {
      super.updateTargetRegion(region);
    } else if (region instanceof By || isProtractorBy(region)) {
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
   * @override
   * @protected
   * @param {By|WebElement|EyesWebElement|GetRegion|Region} region
   * @return {GetRegion}
   */
  _regionToRegionProvider(region) {
    if (region instanceof By || isProtractorBy(region)) {
      return new IgnoreRegionBySelector(region);
    }

    if (region instanceof WebElement) {
      return new IgnoreRegionByElement(region);
    }

    return super._regionToRegionProvider(region);
  }

  /**
   * @deprecated use {@link ignoreRegions} instead
   */
  ignore(...regions) {
    return this.ignoreRegions(...regions);
  }

  /**
   * @deprecated use {@link ignoreRegions} instead
   */
  ignores(...regions) {
    return this.ignoreRegions(...regions);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * Adds one or more ignore regions.
   * @param {(By|WebElement|EyesWebElement|GetRegion|Region)...} regions A region to ignore when validating.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  ignoreRegions(...regions) {
    // noinspection JSValidateTypes
    return super.ignoreRegions(...regions);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * Adds one or more layout regions.
   * @param {(By|WebElement|EyesWebElement|GetRegion|Region)...} regions A region to match using the Layout method.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  layoutRegions(...regions) {
    // noinspection JSValidateTypes
    return super.layoutRegions(...regions);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * Adds one or more strict regions.
   * @param {(By|WebElement|EyesWebElement|GetRegion|Region)...} regions A region to match using the Strict method.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  strictRegions(...regions) {
    // noinspection JSValidateTypes
    return super.strictRegions(...regions);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @override
   * Adds one or more content regions.
   * @param {(By|WebElement|EyesWebElement|GetRegion|Region)...} regions A region to match using the Content method.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  contentRegions(...regions) {
    // noinspection JSValidateTypes
    return super.contentRegions(...regions);
  }

  // noinspection JSCheckFunctionSignatures
  /**
   * Adds a floating region. A floating region is a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {GetFloatingRegion|Region|FloatingMatchSettings|By|WebElement|EyesWebElement} regionOrContainer The content
   *   rectangle or region container
   * @param {number} [maxUpOffset] How much the content can move up.
   * @param {number} [maxDownOffset] How much the content can move down.
   * @param {number} [maxLeftOffset] How much the content can move to the left.
   * @param {number} [maxRightOffset] How much the content can move to the right.
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  floating(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    if (regionOrContainer instanceof By || isProtractorBy(regionOrContainer)) {
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
      super.floating(regionOrContainer, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset);
    }
    return this;
  }

  // noinspection JSUnusedGlobalSymbols
  // noinspection JSCheckFunctionSignatures
  /**
   * Adds a floating region. A floating region is a region that can be placed within the boundaries of a bigger region.
   *
   * @override
   * @param {number} maxOffset How much each of the content rectangles can move in any direction.
   * @param {(GetFloatingRegion|Region|By|WebElement|EyesWebElement)...} regionsOrContainers One or more content
   *   rectangles or region containers
   * @return {SeleniumCheckSettings} This instance of the settings object.
   */
  floatings(maxOffset, ...regionsOrContainers) {
    super.floatings(maxOffset, ...regionsOrContainers);
    return this;
  }
}

exports.SeleniumCheckSettings = SeleniumCheckSettings;
