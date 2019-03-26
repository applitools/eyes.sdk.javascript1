'use strict';

const { RectangleSize, ArgumentGuard } = require('@applitools/eyes-common');
const { EyesJsBrowserUtils } = require('@applitools/eyes-sdk-core');

const { EyesDriverOperationError } = require('./errors/EyesDriverOperationError');
const { ImageOrientationHandler } = require('./ImageOrientationHandler');
const { JavascriptHandler } = require('./JavascriptHandler');

const JS_GET_ENTIRE_PAGE_SIZE =
  "var width = Math.max(arguments[0].clientWidth, arguments[0].scrollWidth);" +
  "var height = Math.max(arguments[0].clientHeight, arguments[0].scrollHeight);" +
  "return [width, height];";

let imageOrientationHandler = new class ImageOrientationHandlerImpl extends ImageOrientationHandler {
  /**
   * @inheritDoc
   */
  async isLandscapeOrientation(driver) {
    // noinspection JSValidateTypes
    try {
      const capabilities = await driver.getCapabilities();
      return EyesSeleniumUtils.isLandscapeOrientationFromCaps(capabilities);
    } catch (err) {
      throw new EyesDriverOperationError('Failed to get orientation!', err);
    }
  }

  /**
   * @inheritDoc
   */
  async tryAutomaticRotation(logger, driver, image) { // eslint-disable-line no-unused-vars
    return 0;
  }
}();

let javascriptHandler = new class JavascriptHandlerImpl extends JavascriptHandler {}();

/**
 * @param {Logger} logger
 * @param {IWebDriver} driver
 * @param {RectangleSize} requiredSize
 * @param {number} sleep
 * @param {number} retriesLeft
 * @return {Promise<boolean>}
 */
async function setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft) {
  logger.verbose(`Trying to set browser size to: ${requiredSize}`);
  await driver.manage().window().setRect(requiredSize.toJSON());
  await driver.sleep(sleep);

  const rect = await driver.manage().window().getRect();
  const currentSize = new RectangleSize(rect);
  logger.verbose(`Current browser size: ${currentSize}`);
  if (currentSize.equals(requiredSize)) {
    return true;
  }

  if (retriesLeft <= 1) {
    logger.verbose('Failed to set browser size: retries is out.');
    return false;
  }

  return setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft - 1);
}

// noinspection OverlyComplexFunctionJS
/**
 * @param {Logger} logger
 * @param {WebDriver} driver
 * @param {RectangleSize} requiredSize
 * @param {RectangleSize} actualVSize
 * @param {RectangleSize} browserSize
 * @param {number} widthDiff
 * @param {number} widthStep
 * @param {number} heightDiff
 * @param {number} heightStep
 * @param {number} currWidthChange
 * @param {number} currHeightChange
 * @param {number} retriesLeft
 * @param {RectangleSize} lastRequiredBrowserSize
 * @return {Promise<boolean>}
 */
async function setViewportSizeLoop(
  logger,
  driver,
  requiredSize,
  actualVSize,
  browserSize,
  widthDiff,
  widthStep,
  heightDiff,
  heightStep,
  currWidthChange,
  currHeightChange,
  retriesLeft,
  lastRequiredBrowserSize
) {
  logger.verbose(`Retries left: ${retriesLeft}`);

  // We specifically use "<=" (and not "<"), so to give an extra resize attempt in addition to reaching the diff, due
  // to floating point issues.
  if (Math.abs(currWidthChange) <= Math.abs(widthDiff) && actualVSize.getWidth() !== requiredSize.getWidth()) {
    currWidthChange += widthStep;
  }

  if (Math.abs(currHeightChange) <= Math.abs(heightDiff) && actualVSize.getHeight() !== requiredSize.getHeight()) {
    currHeightChange += heightStep;
  }

  const requiredBrowserSize = new RectangleSize({
    width: browserSize.getWidth() + currWidthChange,
    height: browserSize.getHeight() + currHeightChange,
  });

  if (requiredBrowserSize.equals(lastRequiredBrowserSize)) {
    logger.verbose('Browser size is as required but viewport size does not match!');
    logger.verbose(`Browser size: ${requiredBrowserSize}, Viewport size: ${actualVSize}`);
    logger.verbose('Stopping viewport size attempts.');
    return true;
  }

  await EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize);
  lastRequiredBrowserSize = requiredBrowserSize;
  const finalViewportSize = await EyesSeleniumUtils.getViewportSize(driver);

  logger.verbose(`Current viewport size: ${finalViewportSize}`);
  if (finalViewportSize.equals(requiredSize)) {
    return true;
  }

  if ((Math.abs(currWidthChange) <= Math.abs(widthDiff) || Math.abs(currHeightChange) <= Math.abs(heightDiff)) && (retriesLeft > 1)) {
    return setViewportSizeLoop(
      logger, driver, requiredSize, finalViewportSize, browserSize, widthDiff, widthStep, heightDiff, heightStep,
      currWidthChange, currHeightChange, retriesLeft - 1, lastRequiredBrowserSize
    );
  }

  throw new Error('EyesError: failed to set window size! Zoom workaround failed.');
}

/**
 * Handles browser related functionality.
 */
class EyesSeleniumUtils extends EyesJsBrowserUtils {
  /**
   * @param {ImageOrientationHandler} value
   */
  static setImageOrientationHandler(value) {
    imageOrientationHandler = value;
  }

  /**
   * @param {IWebDriver} driver - The driver for which to check if it represents a mobile device.
   * @return {Promise<boolean>} {@code true} if the platform running the test is a mobile platform. {@code false}
   *   otherwise.
   */
  static async isMobileDevice(driver) {
    const capabilities = await driver.getCapabilities();
    return EyesSeleniumUtils.isMobileDeviceFromCaps(capabilities);
  }

  /**
   * @param {Capabilities} capabilities - The driver's capabilities.
   * @return {boolean} {@code true} if the platform running the test is a mobile platform. {@code false} otherwise.
   */
  static isMobileDeviceFromCaps(capabilities) {
    const platformName = (capabilities.get('platformName') || capabilities.get('platform')).toUpperCase();
    return platformName === 'ANDROID' || ['MAC', 'IOS'].includes(platformName);
  }

  /**
   * @param {IWebDriver} driver - The driver for which to check the orientation.
   * @return {Promise<boolean>} {@code true} if this is a mobile device and is in landscape orientation. {@code
   *   false} otherwise.
   */
  static isLandscapeOrientation(driver) {
    return imageOrientationHandler.isLandscapeOrientation(driver);
  }

  /**
   * @param {Capabilities} capabilities - The driver's capabilities.
   * @return {boolean} {@code true} if this is a mobile device and is in landscape orientation. {@code false} otherwise.
   */
  static isLandscapeOrientationFromCaps(capabilities) {
    const capsOrientation = capabilities.get('orientation') || capabilities.get('deviceOrientation');
    return capsOrientation === 'LANDSCAPE';
  }

  /**
   * @param {Logger} logger
   * @param {IWebDriver} driver
   * @param {MutableImage} image
   * @return {Promise<number>}
   */
  static tryAutomaticRotation(logger, driver, image) {
    return imageOrientationHandler.tryAutomaticRotation(logger, driver, image);
  }

  /**
   * @param {JavascriptHandler} handler
   */
  static setJavascriptHandler(handler) {
    javascriptHandler = handler;
  }

  /**
   * @param {string} script
   * @param {...object} args
   */
  static handleSpecialCommands(script, ...args) {
    return javascriptHandler.handle(script, ...args);
  }

  /**
   * Gets entire element size.
   *
   * @param {EyesJsExecutor} executor
   * @param {WebElement} element
   * @return {RectangleSize} - The entire element size
   */
  static async getEntireElementSize(executor, element) {
    try {
      const result = await executor.executeScript(JS_GET_ENTIRE_PAGE_SIZE, element);
      return new RectangleSize(Math.ceil(result[0]) || 0, Math.ceil(result[1]) || 0);
    } catch (err) {
      throw new EyesDriverOperationError("Failed to extract entire size!", err);
    }
  }

  /**
   * @param {Logger} logger - The logger to use.
   * @param {EyesWebDriver|WebDriver} driver - The web driver to use.
   * @return {Promise<RectangleSize>} - The viewport size of the current context, or the display size if the viewport
   *   size cannot be retrieved.
   */
  static async getViewportSizeOrDisplaySize(logger, driver) {
    try {
      logger.verbose('getViewportSizeOrDisplaySize()');
      return await EyesSeleniumUtils.getViewportSize(driver);
    } catch (err) {
      logger.verbose('Failed to extract viewport size using Javascript:', err);

      // If we failed to extract the viewport size using JS, will use the window size instead.
      logger.verbose('Using window size as viewport size.');
      let { width, height } = await driver.manage().window().getRect();

      // noinspection EmptyCatchBlockJS
      try {
        const isLandscape = await EyesSeleniumUtils.isLandscapeOrientation(driver);
        if (isLandscape && height > width) {
          const temp = width;
          // noinspection JSSuspiciousNameCombination
          width = height;
          height = temp;
        }
      } catch (ignored) {
        // Not every IWebDriver supports querying for orientation.
      }

      logger.verbose(`Done! Size ${width} x ${height}`);
      return new RectangleSize({ width, height });
    }
  }

  /**
   * @param {Logger} logger - The logger to use.
   * @param {IWebDriver} driver - The web driver to use.
   * @param {RectangleSize} requiredSize - The size to set
   * @return {Promise<boolean>}
   */
  static setBrowserSize(logger, driver, requiredSize) {
    // noinspection MagicNumberJS
    const SLEEP = 1000;
    const RETRIES = 3;

    return setBrowserSizeLoop(logger, driver, requiredSize, SLEEP, RETRIES);
  }

  /**
   * @param {Logger} logger - The logger to use.
   * @param {IWebDriver} driver - The web driver to use.
   * @param {RectangleSize} actualViewportSize
   * @param {RectangleSize} requiredViewportSize
   * @return {Promise<boolean>}
   */
  static async setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredViewportSize) {
    const browserSize = await driver.manage().window().getRect();
    const currentSize = new RectangleSize(browserSize);
    logger.verbose(`Current browser size: ${currentSize}`);
    const requiredBrowserSize = new RectangleSize({
      width: currentSize.getWidth() + (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
      height: currentSize.getHeight() + (requiredViewportSize.getHeight() - actualViewportSize.getHeight()),
    });
    return EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize);
  }

  /**
   * Tries to set the viewport size
   *
   * @param {Logger} logger - The logger to use.
   * @param {EyesWebDriver|WebDriver} driver - The web driver to use.
   * @param {RectangleSize} requiredSize - The viewport size.
   * @return {Promise<boolean>}
   */
  static async setViewportSize(logger, driver, requiredSize) {
    ArgumentGuard.notNull(requiredSize, 'requiredSize');

    // First we will set the window size to the required size.
    // Then we'll check the viewport size and increase the window size accordingly.
    logger.verbose(`setViewportSize(${requiredSize})`);
    const initViewportSize = await EyesSeleniumUtils.getViewportSize(driver);
    logger.verbose(`Initial viewport size: ${initViewportSize}`);

    // If the viewport size is already the required size
    if (initViewportSize.equals(requiredSize)) {
      logger.verbose('Required size already set.');
      return true;
    }

    try {
      // We move the window to (0,0) to have the best chance to be able to set the viewport size as requested.
      await driver.manage().window().setRect({ x: 0, y: 0 });
    } catch (ignored) {
      logger.verbose('Warning: Failed to move the browser window to (0,0)');
    }

    await EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, initViewportSize, requiredSize);
    const actualViewportSize = await EyesSeleniumUtils.getViewportSize(driver);

    if (actualViewportSize.equals(requiredSize)) {
      return true;
    }

    // Additional attempt. This Solves the "maximized browser" bug
    // (border size for maximized browser sometimes different than non-maximized, so the original browser size
    // calculation is  wrong).
    logger.verbose('Trying workaround for maximization...');
    await EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredSize);
    const finalViewportSize = await EyesSeleniumUtils.getViewportSize(driver);

    logger.verbose(`Current viewport size: ${finalViewportSize}`);
    if (finalViewportSize.equals(requiredSize)) {
      return true;
    }

    const MAX_DIFF = 3;
    const widthDiff = finalViewportSize.getWidth() - requiredSize.getWidth();
    const widthStep = widthDiff > 0 ? -1 : 1; // -1 for smaller size, 1 for larger
    const heightDiff = finalViewportSize.getHeight() - requiredSize.getHeight();
    const heightStep = heightDiff > 0 ? -1 : 1;

    const rect = await driver.manage().window().getRect();
    const browserSize = new RectangleSize(rect);

    const currWidthChange = 0;
    const currHeightChange = 0;
    // We try the zoom workaround only if size difference is reasonable.
    if (Math.abs(widthDiff) <= MAX_DIFF && Math.abs(heightDiff) <= MAX_DIFF) {
      logger.verbose('Trying workaround for zoom...');
      const retriesLeft = Math.abs((widthDiff === 0 ? 1 : widthDiff) * (heightDiff === 0 ? 1 : heightDiff)) * 2;

      const lastRequiredBrowserSize = null;
      return setViewportSizeLoop(
        logger, driver, requiredSize, finalViewportSize, browserSize, widthDiff, widthStep, heightDiff,
        heightStep, currWidthChange, currHeightChange, retriesLeft, lastRequiredBrowserSize
      );
    }

    throw new Error('EyesError: failed to set window size!');
  }
}

exports.EyesSeleniumUtils = EyesSeleniumUtils;
