'use strict';

const { WebElementPromise } = require('selenium-webdriver');

const { EyesWebElement } = require('./EyesWebElement');

/**
 * EyesWebElementPromise is a promise that will be fulfilled with a WebElement.
 * This serves as a forward proxy on WebElement, allowing calls to be scheduled without directly on this instance
 * before the underlying WebElement has been fulfilled. In other words, the following two statements are equivalent:
 *
 *     driver.findElement({id: 'my-button'}).click();
 *     driver.findElement({id: 'my-button'}).then(function(el) {
 *       return el.click();
 *     });
 *
 * @final
 */
class EyesWebElementPromise extends EyesWebElement {
  /**
   * @param {Logger} logger
   * @param {!EyesWebDriver} driver The parent WebDriver instance for this element.
   * @param {!Promise<!WebElement>} el A promise that will resolve to the promised element.
   */
  constructor(logger, driver, el) {
    const webElement = new WebElementPromise(driver.getRemoteWebDriver(), el);
    super(logger, driver, webElement);

    // noinspection JSUnresolvedVariable
    /** @override */
    this.then = el.then.bind(el);

    // noinspection JSUnresolvedVariable
    /** @override */
    this.catch = el.catch.bind(el);

    /**
     * Defers returning the element ID until the wrapped WebElement has been resolved.
     * @override
     */
    this.getId = () => el.then(el2 => el2.getId());
  }
}

exports.EyesWebElementPromise = EyesWebElementPromise;
