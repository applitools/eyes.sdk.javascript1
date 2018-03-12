'use strict';

const {RectangleSize, ArgumentGuard, EyesJsBrowserUtils} = require('@applitools/eyes.sdk.core');

const EyesDriverOperationError = require('./errors/EyesDriverOperationError');
const ImageOrientationHandler = require('./ImageOrientationHandler');
const JavascriptHandler = require('./JavascriptHandler');

let imageOrientationHandlerHandler = new class ImageOrientationHandlerImpl extends ImageOrientationHandler {
    /** @override */
    isLandscapeOrientation(driver) {
        // noinspection JSValidateTypes
        return driver.getCapabilities().then(capabilities => {
            return EyesSeleniumUtils.isLandscapeOrientationFromCaps(capabilities);
        }).catch(err => {
            throw new EyesDriverOperationError("Failed to get orientation!", err);
        });
    }

    /** @override */
    tryAutomaticRotation(logger, driver, image) {
        // noinspection JSValidateTypes
        return driver.controlFlow().execute(() => 0);
    }
};

let javascriptHandler = new class JavascriptHandlerImpl extends JavascriptHandler {
    /** @override */
    handle(script, ...args) {
        throw new Error('You should init javascriptHandler before, using setJavascriptHandler method.');
    }
};

/**
 * Handles browser related functionality.
 */
class EyesSeleniumUtils extends EyesJsBrowserUtils {

    /**
     * @param {ImageOrientationHandler} imageOrientationHandler
     */
    static setImageOrientationHandlerHandler(imageOrientationHandler) {
        imageOrientationHandlerHandler = imageOrientationHandler;
    }

    /**
     * @param {IWebDriver} driver The driver for which to check the orientation.
     * @returns {Promise.<Boolean>} {@code true} if this is a mobile device and is in landscape orientation. {@code false} otherwise.
     */
    static isLandscapeOrientation(driver) {
        return imageOrientationHandlerHandler.isLandscapeOrientation(driver);
    }

    /**
     * @param {Capabilities} capabilities The driver's capabilities.
     * @return {Boolean} {@code true} if this is a mobile device and is in landscape orientation. {@code false} otherwise.
     */
    static isLandscapeOrientationFromCaps(capabilities) {
        const capsOrientation = capabilities.get('orientation') || capabilities.get('deviceOrientation');
        return capsOrientation === 'LANDSCAPE';
    }

    /**
     * @param {Logger} logger
     * @param {IWebDriver} driver
     * @param {MutableImage} image
     * @returns {Promise.<int>}
     */
    static tryAutomaticRotation(logger, driver, image){
        return imageOrientationHandlerHandler.tryAutomaticRotation(logger, driver, image);
    }

    /**
     * @param {JavascriptHandler} handler
     */
    static setJavascriptHandler(handler) {
        javascriptHandler = handler;
    }

    /**
     * @param {String} script
     * @param {Object...} args
     */
    static handleSpecialCommands(script, ...args) {
        return javascriptHandler.handle(script, ...args);
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @return {Promise.<RectangleSize>} The viewport size of the current context, or the display size if the viewport size cannot be retrieved.
     */
    static getViewportSizeOrDisplaySize(logger, driver) {
        logger.verbose("getViewportSizeOrDisplaySize()");

        return EyesSeleniumUtils.getViewportSize(driver).catch(err => {
            logger.verbose("Failed to extract viewport size using Javascript:", err);

            // If we failed to extract the viewport size using JS, will use the window size instead.
            logger.verbose("Using window size as viewport size.");
            return driver.manage().window().getSize().then(/** {width:number, height:number} */ result => {
                let width = result.width;
                let height = result.height;
                return EyesSeleniumUtils.isLandscapeOrientation(driver).then(result => {
                    if (result && height > width) {
                        const temp = width;
                        // noinspection JSSuspiciousNameCombination
                        width = height;
                        height = temp;
                    }
                }).catch(ignore => {
                    // Not every IWebDriver supports querying for orientation.
                }).then(() => {
                    logger.verbose(`Done! Size ${width} x ${height}`);
                    return new RectangleSize(width, height);
                });
            });
        });
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} requiredSize The size to set
     * @return {Promise.<Boolean>}
     */
    static setBrowserSize(logger, driver, requiredSize) {
        // noinspection MagicNumberJS
        const SLEEP = 1000;
        const RETRIES = 3;

        return EyesSeleniumUtils._setBrowserSizeLoop(logger, driver, requiredSize, SLEEP, RETRIES);
    }

    static _setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft) {
        logger.verbose(`Trying to set browser size to: ${requiredSize}`);

        return driver.manage().window().setSize(requiredSize.getWidth(), requiredSize.getHeight()).then(() => {
            return driver.sleep(sleep);
        }).then(() => {
            return driver.manage().window().getSize();
        }).then(/** {width:number, height:number} */ result => {
            const currentSize = new RectangleSize(result.width, result.height);
            logger.verbose(`Current browser size: ${currentSize}`);
            if (currentSize.equals(requiredSize)) {
                return true;
            }

            --retriesLeft;

            if (retriesLeft === 0) {
                logger.verbose("Failed to set browser size: retries is out.");
                return false;
            }

            return EyesSeleniumUtils._setBrowserSizeLoop(logger, driver, requiredSize, sleep, retriesLeft);
        });
    }

    /**
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} actualViewportSize
     * @param {RectangleSize} requiredViewportSize
     * @return {Promise.<Boolean>}
     */
    static setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredViewportSize) {
        return driver.manage().window().getSize().then(/** {width:number, height:number} */ browserSize => {
            const currentSize = new RectangleSize(browserSize);
            logger.verbose(`Current browser size: ${currentSize}`);
            const requiredBrowserSize = new RectangleSize(
                currentSize.getWidth() + (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
                currentSize.getHeight() + (requiredViewportSize.getHeight() - actualViewportSize.getHeight())
            );
            return EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize);
        });
    }

    /**
     * Tries to set the viewport size
     *
     * @param {Logger} logger The logger to use.
     * @param {IWebDriver} driver The web driver to use.
     * @param {RectangleSize} requiredSize The viewport size.
     * @return {Promise}
     */
    static setViewportSize(logger, driver, requiredSize) {
        ArgumentGuard.notNull(requiredSize, "requiredSize");

        // First we will set the window size to the required size.
        // Then we'll check the viewport size and increase the window size accordingly.
        logger.verbose(`setViewportSize(${requiredSize})`);
        return EyesSeleniumUtils.getViewportSize(driver).then(actualViewportSize => {
            logger.verbose(`Initial viewport size: ${actualViewportSize}`);

            // If the viewport size is already the required size
            if (actualViewportSize.equals(requiredSize)) {
                logger.verbose("Required size already set.");
                return;
            }

            // We move the window to (0,0) to have the best chance to be able to set the viewport size as requested.
            return driver.manage().window().setPosition(0, 0).catch(ignore => {
                logger.verbose("Warning: Failed to move the browser window to (0,0)");
            }).then(() => {
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredSize);
            }).then(() => {
                return EyesSeleniumUtils.getViewportSize(driver);
            }).then(actualViewportSize => {
                if (actualViewportSize.equals(requiredSize)) {
                    return;
                }

                // Additional attempt. This Solves the "maximized browser" bug
                // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is  wrong).
                logger.verbose("Trying workaround for maximization...");
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(logger, driver, actualViewportSize, requiredSize).then(() => {
                    return EyesSeleniumUtils.getViewportSize(driver);
                }).then(/** RectangleSize */ actualViewportSize => {
                    logger.verbose(`Current viewport size: ${actualViewportSize}`);
                    if (actualViewportSize.equals(requiredSize)) {
                        return;
                    }

                    const MAX_DIFF = 3;
                    const widthDiff = actualViewportSize.getWidth() - requiredSize.getWidth();
                    const widthStep = widthDiff > 0 ? -1 : 1; // -1 for smaller size, 1 for larger
                    const heightDiff = actualViewportSize.getHeight() - requiredSize.getHeight();
                    const heightStep = heightDiff > 0 ? -1 : 1;

                    return driver.manage().window().getSize().then(/** {width:number, height:number} */ result => {
                        const browserSize = new RectangleSize(result.width, result.height);

                        const currWidthChange = 0;
                        const currHeightChange = 0;
                        // We try the zoom workaround only if size difference is reasonable.
                        if (Math.abs(widthDiff) <= MAX_DIFF && Math.abs(heightDiff) <= MAX_DIFF) {
                            logger.verbose("Trying workaround for zoom...");
                            const retriesLeft = Math.abs((widthDiff === 0 ? 1 : widthDiff) * (heightDiff === 0 ? 1 : heightDiff)) * 2;

                            const lastRequiredBrowserSize = null;
                            return EyesSeleniumUtils._setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize,
                                widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                                retriesLeft, lastRequiredBrowserSize);
                        }

                        throw new Error("EyesError: failed to set window size!");
                    });
                });
            });
        });
    }

    // noinspection OverlyComplexFunctionJS
    static _setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize, widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange, retriesLeft, lastRequiredBrowserSize) {
        logger.verbose(`Retries left: ${retriesLeft}`);
        // We specifically use "<=" (and not "<"), so to give an extra resize attempt in addition to reaching the diff, due to floating point issues.
        if (Math.abs(currWidthChange) <= Math.abs(widthDiff) && actualViewportSize.getWidth() !== requiredSize.getWidth()) {
            currWidthChange += widthStep;
        }

        if (Math.abs(currHeightChange) <= Math.abs(heightDiff) && actualViewportSize.getHeight() !== requiredSize.getHeight()) {
            currHeightChange += heightStep;
        }

        const requiredBrowserSize = new RectangleSize(browserSize.getWidth()+ currWidthChange, browserSize.getHeight() + currHeightChange);
        if (requiredBrowserSize.equals(lastRequiredBrowserSize)) {
            logger.verbose("Browser size is as required but viewport size does not match!");
            logger.verbose(`Browser size: ${requiredBrowserSize} , Viewport size: ${actualViewportSize}`);
            logger.verbose("Stopping viewport size attempts.");
            return driver.controlFlow().promise(resolve => resolve());
        }

        return EyesSeleniumUtils.setBrowserSize(logger, driver, requiredBrowserSize).then(() => {
            lastRequiredBrowserSize = requiredBrowserSize;
            return EyesSeleniumUtils.getViewportSize(driver);
        }).then(actualViewportSize => {
            logger.verbose(`Current viewport size: ${actualViewportSize}`);
            if (actualViewportSize.equals(requiredSize)) {
                return;
            }

            --retriesLeft;

            if ((Math.abs(currWidthChange) <= Math.abs(widthDiff) || Math.abs(currHeightChange) <= Math.abs(heightDiff)) && (retriesLeft > 0)) {
                return EyesSeleniumUtils._setViewportSizeLoop(logger, driver, requiredSize, actualViewportSize, browserSize,
                    widthDiff, widthStep, heightDiff, heightStep, currWidthChange, currHeightChange,
                    retriesLeft, lastRequiredBrowserSize);
            }

            throw new Error("EyesError: failed to set window size! Zoom workaround failed.");
        });
    }
}

module.exports = EyesSeleniumUtils;
