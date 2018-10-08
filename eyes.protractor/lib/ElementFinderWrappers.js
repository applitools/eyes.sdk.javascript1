'use strict';

const { GeneralUtils } = require('@applitools/eyes.sdk.core');
const { EyesWebElementPromise, EyesWebElement } = require('@applitools/eyes.selenium');

// functions in ElementFinder that return a new ElementFinder and therefore we must wrap and return our own
const ELEMENT_FINDER_TO_ELEMENT_FINDER_FUNCTIONS = ['clone', 'element', '$', 'evaluate', 'allowAnimations'];
// functions in ElementFinder that return a new ElementArrayFinder and therefore we must wrap and return our own
const ELEMENT_FINDER_TO_ELEMENT_ARRAY_FINDER_FUNCTIONS = ['all', '$$'];
// function in ElementArrayFinder that return a new ElementFinder and therefore we must wrap and return our own
const ELEMENT_ARRAY_FINDER_TO_ELEMENT_FINDER_FUNCTIONS = ['get', 'first', 'last'];

/**
 * Wraps Protractor's ElementFinder to make sure we return our own Web Element.
 *
 * @mixin ElementFinder
 */
class ElementFinderWrapper extends EyesWebElement {
  /**
   * Wrapper for ElementFinder object from Protractor
   *
   * @param {Logger} logger
   * @param {EyesWebDriver} eyesDriver
   * @param {ElementFinder} finder
   */
  constructor(logger, eyesDriver, finder) {
    super(logger, eyesDriver, finder.getWebElement());
    GeneralUtils.mixin(this, finder);

    this._logger = logger;
    this._eyesDriver = eyesDriver;
    this._finder = finder;

    ELEMENT_FINDER_TO_ELEMENT_FINDER_FUNCTIONS.forEach(fnName => {
      this[fnName] = (...args) => new ElementFinderWrapper(this._logger, this._eyesDriver, this._finder[fnName](...args));
    });

    ELEMENT_FINDER_TO_ELEMENT_ARRAY_FINDER_FUNCTIONS.forEach(fnName => {
      this[fnName] = (...args) => new ElementArrayFinderWrapper(this._logger, this._eyesDriver, this._finder[fnName](...args));
    });
  }

  /**
   * Wrap the getWebElement function
   *
   * @return {EyesWebElementPromise}
   */
  getWebElement() {
    return new EyesWebElementPromise(this._logger, this._eyesDriver, this._finder.getWebElement());
  }
}

class ElementArrayFinderWrapper {
  /**
   * Wrapper for ElementArrayFinder object from Protractor
   *
   * @param {Logger} logger
   * @param {EyesWebDriver} eyesDriver
   * @param {ElementArrayFinder} arrayFinder
   */
  constructor(logger, eyesDriver, arrayFinder) {
    GeneralUtils.mixin(this, arrayFinder);

    this._logger = logger;
    this._eyesDriver = eyesDriver;
    this._arrayFinder = arrayFinder;

    // Wrap the functions that return objects that require pre-wrapping
    ELEMENT_ARRAY_FINDER_TO_ELEMENT_FINDER_FUNCTIONS.forEach(fnName => {
      this[fnName] = (...args) => new ElementFinderWrapper(this._logger, this._eyesDriver, this._arrayFinder[fnName](...args));
    });

    // Patch this internal function.
    const originalFn = this._arrayFinder.asElementFinders_;
    this._arrayFinder.asElementFinders_ = () => originalFn.apply(this._arrayFinder).then(arr => {
      const list = [];
      arr.forEach(finder => {
        list.push(new ElementFinderWrapper(this._logger, this._eyesDriver, finder));
      });
      return list;
    });
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Wrap the getWebElements function
   *
   * @return {Promise<EyesWebElementPromise[]>}
   */
  async getWebElements() {
    this._logger.verbose('ElementArrayFinderWrapper:getWebElements - called');

    const elements = await this._arrayFinder.getWebElements();
    return elements.map(element => new EyesWebElementPromise(this._logger, this._eyesDriver, element));
  }
}

exports.ElementFinderWrapper = ElementFinderWrapper;
exports.ElementArrayFinderWrapper = ElementArrayFinderWrapper;
