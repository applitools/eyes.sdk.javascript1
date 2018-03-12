'use strict';

const {
    EyesBase, FixedScaleProviderFactory, NullScaleProvider, RegionProvider, NullRegionProvider, ContextBasedScaleProviderFactory,
    ScaleProviderIdentityFactory, ArgumentGuard, SimplePropertyHandler, Logger,CoordinatesType, TestFailedError, NullCutProvider,
    UserAgent, ReadOnlyPropertyHandler, Region, Location, RectangleSize, FailureReports
} = require('@applitools/eyes.sdk.core');

const ImageProviderFactory = require('./capture/ImageProviderFactory');
const EyesWebDriverScreenshotFactory = require('./capture/EyesWebDriverScreenshotFactory');
const FullPageCaptureAlgorithm = require('./capture/FullPageCaptureAlgorithm');
const FrameChain = require('./frames/FrameChain');
const EyesWebDriver = require('./wrappers/EyesWebDriver');
const EyesSeleniumUtils = require('./EyesSeleniumUtils');
const EyesWebElement = require('./wrappers/EyesWebElement');
const EyesWebDriverScreenshot = require('./capture/EyesWebDriverScreenshot');
const RegionPositionCompensationFactory = require('./positioning/RegionPositionCompensationFactory');
const ImageRotation = require('./positioning/ImageRotation');
const ScrollPositionProvider = require('./positioning/ScrollPositionProvider');
const CssTranslatePositionProvider = require('./positioning/CssTranslatePositionProvider');
const ElementPositionProvider = require('./positioning/ElementPositionProvider');
const StitchMode = require('./positioning/StitchMode');
const MoveToRegionVisibilityStrategy = require('./regionVisibility/MoveToRegionVisibilityStrategy');
const NopRegionVisibilityStrategy = require('./regionVisibility/NopRegionVisibilityStrategy');
const SeleniumJavaScriptExecutor = require('./SeleniumJavaScriptExecutor');
const JavascriptHandler = require('./JavascriptHandler');
const Target = require('./fluent/Target');

const VERSION = require('../package.json').version;

const DEFAULT_STITCHING_OVERLAP = 50; // px
const DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100; // Milliseconds
const DEFAULT_WAIT_SCROLL_STABILIZATION = 200; // Milliseconds

/**
 * The main API gateway for the SDK.
 */
class Eyes extends EyesBase {

    /**
     * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
     *
     * @param {String} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
     * @param {Boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
     * @param {PromiseFactory} [promiseFactory] If not specified will be created using `Promise` object
     **/
    constructor(serverUrl, isDisabled, promiseFactory) {
        super(serverUrl, isDisabled, promiseFactory);

        /** @type {EyesWebDriver} */
        this._driver = undefined;
        /** @type {boolean} */
        this._dontGetTitle = false;

        /** @type {boolean} */
        this._forceFullPageScreenshot = false;
        /** @type {boolean} */
        this._checkFrameOrElement = false;

        /** @type {String} */
        this._originalDefaultContentOverflow = false;
        /** @type {String} */
        this._originalFrameOverflow = false;

        /** @type {Region} */
        this._regionToCheck = null;

        /** @type {boolean} */
        this._hideScrollbars = false;
        /** @type {ImageRotation} */
        this._rotation = undefined;
        /** @type {number} */
        this._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
        /** @type {StitchMode} */
        this._stitchMode = StitchMode.SCROLL;
        /** @type {int} */
        this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;
        /** @type {RegionVisibilityStrategy} */
        this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        /** @type {ElementPositionProvider} */
        this._elementPositionProvider = undefined;
        /** @type {SeleniumJavaScriptExecutor} */
        this._jsExecutor = undefined;

        /** @type {UserAgent} */
        this._userAgent = undefined;
        /** @type {ImageProvider} */
        this._imageProvider = undefined;
        /** @type {RegionPositionCompensation} */
        this._regionPositionCompensation = undefined;

        /** @type {EyesWebElement} */
        this._targetElement = null;

        /** @type {boolean} */
        this._stitchContent = false;
        /** @type {int} */
        this._stitchingOverlap = DEFAULT_STITCHING_OVERLAP;

        this._init();
    }

    /**
     * @private
     */
    _init() {
        EyesSeleniumUtils.setJavascriptHandler(new JavascriptHandler(this.getPromiseFactory()));
    }

    // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
    /**
     * @override
     */
    getBaseAgentId() {
        return `selenium-js/${VERSION}`;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Region}
     */
    getRegionToCheck() {
        return this._regionToCheck;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {Region} regionToCheck
     */
    setRegionToCheck(regionToCheck) {
        this._regionToCheck = regionToCheck;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean}
     */
    shouldStitchContent() {
        return this._stitchContent;
    }

    /**
     * @return {?EyesWebDriver}
     */
    getDriver() {
        return this._driver;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
     *
     * @param {boolean} shouldForce Whether to force a full page screenshot or not.
     */
    setForceFullPageScreenshot(shouldForce) {
        this._forceFullPageScreenshot = shouldForce;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether Eyes should force a full page screenshot.
     */
    getForceFullPageScreenshot() {
        return this._forceFullPageScreenshot;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a full page stitching).
     *
     * @param {int} waitBeforeScreenshots The time to wait (Milliseconds). Values smaller or equal to 0, will cause the default value to be used.
     */
    setWaitBeforeScreenshots(waitBeforeScreenshots) {
        if (waitBeforeScreenshots <= 0) {
            this._waitBeforeScreenshots = DEFAULT_WAIT_BEFORE_SCREENSHOTS;
        } else {
            this._waitBeforeScreenshots = waitBeforeScreenshots;
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} The time to wait just before taking a screenshot.
     */
    getWaitBeforeScreenshots() {
        return this._waitBeforeScreenshots;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Turns on/off the automatic scrolling to a region being checked by {@code checkRegion}.
     *
     * @param {boolean} shouldScroll Whether to automatically scroll to a region being validated.
     */
    setScrollToRegion(shouldScroll) {
        if (shouldScroll) {
            this._regionVisibilityStrategy = new MoveToRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        } else {
            this._regionVisibilityStrategy = new NopRegionVisibilityStrategy(this._logger, this.getPromiseFactory());
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether to automatically scroll to a region being validated.
     */
    getScrollToRegion() {
        return !(this._regionVisibilityStrategy instanceof NopRegionVisibilityStrategy);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar, use {@link StitchMode#CSS}.
     * Default is {@link StitchMode#SCROLL}.
     *
     * @param {StitchMode} mode The stitch mode to set.
     */
    setStitchMode(mode) {
        this._logger.verbose(`setting stitch mode to ${mode}`);

        this._stitchMode = mode;
        if (this._driver) {
            this._initPositionProvider();
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {StitchMode}  The current stitch mode settings.
     */
    getStitchMode() {
        return this._stitchMode;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets the stitching overlap in pixels.
     *
     * @param {int} pixels The width (in pixels) of the overlap.
     */
    setStitchOverlap(pixels) {
        this._stitchingOverlap = pixels;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {int} Returns the stitching overlap in pixels.
     */
    getStitchOverlap() {
        return this._stitchingOverlap;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Hide the scrollbars when taking screenshots.
     *
     * @param {boolean} shouldHide Whether to hide the scrollbars or not.
     */
    setHideScrollbars(shouldHide) {
        this._hideScrollbars = shouldHide;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {boolean} Whether or not scrollbars are hidden when taking screenshots.
     */
    getHideScrollbars() {
        return this._hideScrollbars;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {ImageRotation} rotation The image rotation data.
     */
    setRotation(rotation) {
        this._rotation = rotation;
        if (this._driver) {
            this._driver.setRotation(rotation);
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @return {ImageRotation} The image rotation data.
     */
    getRotation() {
        return this._rotation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if it wasn't possible to extract it.
     */
    getDevicePixelRatio() {
        return this._devicePixelRatio;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Starts a test.
     *
     * @param {WebDriver} driver The web driver that controls the browser hosting the application under test.
     * @param {String} appName The name of the application under test.
     * @param {String} testName The test name.
     * @param {RectangleSize|{width: number, height: number}} [viewportSize=null] The required browser's viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
     * @param {SessionType} [sessionType=null] The type of test (e.g.,  standard test / visual performance test).
     * @return {Promise.<EyesWebDriver>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
     */
    open(driver, appName, testName, viewportSize = null, sessionType = null) {
        ArgumentGuard.notNull(driver, "driver");

        const that = this;
        that._flow = driver.controlFlow();
        // Set PromiseFactory to work with the protractor control flow and promises
        const promiseFn = that.getPromiseFactory().getFactoryMethod();
        that.getPromiseFactory().setFactoryMethod(asyncAction => that._flow.execute(() => {
            return promiseFn(asyncAction);
        }));

        if (this.getIsDisabled()) {
            this._logger.verbose("Ignored");
            return this.getPromiseFactory().resolve(driver);
        }

        that._initDriver(driver);

        return that._driver.getUserAgent().then(uaString => {
            if (uaString) {
                that._userAgent = UserAgent.parseUserAgentString(uaString, true);
            }

            that._imageProvider = ImageProviderFactory.getImageProvider(that._userAgent, that, that._logger, that._driver);
            that._regionPositionCompensation = RegionPositionCompensationFactory.getRegionPositionCompensation(that._userAgent, that, that._logger);

            return super.openBase(appName, testName, viewportSize, sessionType);
        }).then(() => {
            that._devicePixelRatio = Eyes.UNKNOWN_DEVICE_PIXEL_RATIO;
            that._jsExecutor = new SeleniumJavaScriptExecutor(that._driver);

            that._initPositionProvider();

            that._driver.setRotation(this._rotation);
            return that._driver;
        });
    }

    /** @private */
    _initDriver(driver) {
        if (driver instanceof EyesWebDriver) {
            // noinspection JSValidateTypes
            this._driver = driver;
        } else {
            this._driver = new EyesWebDriver(this._logger, this, driver);
        }
    }

    /** @private */
    _initPositionProvider() {
        // Setting the correct position provider.
        const stitchMode = this.getStitchMode();
        this._logger.verbose("initializing position provider. stitchMode: " + stitchMode);
        switch (stitchMode) {
            case StitchMode.CSS:
                this.setPositionProvider(new CssTranslatePositionProvider(this._logger, this._jsExecutor));
                break;
            default:
                this.setPositionProvider(new ScrollPositionProvider(this._logger, this._jsExecutor));
        }
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Preform visual validation
     *
     * @param {String} name A name to be associated with the match
     * @param {SeleniumCheckSettings} checkSettings Target instance which describes whether we want a window/region/frame
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    check(name, checkSettings) {
        ArgumentGuard.notNull(checkSettings, "checkSettings");

        const that = this;
        return that.getPromiseFactory().resolve().then(() => {
            that._logger.verbose(`check("${name}", checkSettings) - begin`);
            that._stitchContent = checkSettings.getStitchContent();
            const targetRegion = checkSettings.getTargetRegion();

            let switchedToFrameCount;
            return this._switchToFrame(checkSettings).then(switchedToFrameCount_ => {
                that._regionToCheck = null;
                switchedToFrameCount = switchedToFrameCount_;

                if (targetRegion) {
                    return super.checkWindowBase(new RegionProvider(targetRegion, that.getPromiseFactory()), name, false, checkSettings);
                }

                if (checkSettings) {
                    const targetSelector = checkSettings.getTargetSelector();
                    let targetElement = checkSettings.getTargetElement();
                    if (!targetElement && targetSelector) {
                        targetElement = that._driver.findElement(targetSelector);
                    }

                    if (targetElement) {
                        that._targetElement = targetElement instanceof EyesWebElement ? targetElement : new EyesWebElement(that._logger, that._driver, targetElement);
                        if (that._stitchContent) {
                            return that._checkElement(name, checkSettings);
                        } else {
                            return that._checkRegion(name, checkSettings);
                        }
                    } else if (checkSettings.getFrameChain().length > 0) {
                        if (that._stitchContent) {
                            return that._checkFullFrameOrElement(name, checkSettings);
                        } else {
                            return that._checkFrameFluent(name, checkSettings);
                        }
                    } else {
                        return super.checkWindowBase(new NullRegionProvider(that.getPromiseFactory()), name, false, checkSettings);
                    }
                }
            }).then(() => {
                that._targetElement = null;
                return that._switchToParentFrame(switchedToFrameCount);
            }).then(() => {
                that._stitchContent = false;
                that._logger.verbose("check - done!");
            });
        });
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkFrameFluent(name, checkSettings) {
        const frameChain = new FrameChain(this._logger, this._driver.getFrameChain());
        const targetFrame = frameChain.pop();
        this._targetElement = targetFrame.getReference();

        const that = this;
        return this._driver.switchTo().framesDoScroll(frameChain).then(() => {
            return this._checkRegion(name, checkSettings);
        }).then(() => {
            that._targetElement = null;
        });
    }

    /**
     * @private
     * @return {Promise.<int>}
     */
    _switchToParentFrame(switchedToFrameCount) {
        if (switchedToFrameCount > 0) {
            const that = this;
            return that._driver.switchTo().parentFrame().then(() => {
                switchedToFrameCount--;
                return that._switchToParentFrame(switchedToFrameCount);
            });
        }

        return this.getPromiseFactory().resolve();
    }

    /**
     * @private
     * @return {Promise.<int>}
     */
    _switchToFrame(checkSettings) {
        if (!checkSettings) {
            return this.getPromiseFactory().resolve(0);
        }

        const that = this;
        const frameChain = checkSettings.getFrameChain();
        let switchedToFrameCount = 0;
        return frameChain.reduce((promise, frameLocator) => {
            return promise.then(() => that._switchToFrameLocator(frameLocator)).then(isSuccess => {
                if (isSuccess) {
                    switchedToFrameCount++;
                }
                return switchedToFrameCount;
            });
        }, this.getPromiseFactory().resolve());
    }

    /**
     * @private
     * @return {Promise.<boolean>}
     */
    _switchToFrameLocator(frameLocator) {
        const switchTo = this._driver.switchTo();

        if (frameLocator.getFrameIndex()) {
            return switchTo.frame(frameLocator.getFrameIndex()).then(() => true);
        }

        if (frameLocator.getFrameNameOrId()) {
            return switchTo.frame(frameLocator.getFrameNameOrId()).then(() => true);
        }

        if (frameLocator.getFrameSelector()) {
            const frameElement = this._driver.findElement(frameLocator.getFrameSelector());
            if (frameElement) {
                return switchTo.frame(frameElement).then(() => true);
            }
        }

        return this.getPromiseFactory().resolve(false);
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkFullFrameOrElement(name, checkSettings) {
        this._checkFrameOrElement = true;

        const that = this;
        this._logger.verbose("checkFullFrameOrElement()");

        const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
            // noinspection JSUnusedGlobalSymbols
            /** @override */
            getRegion () {
                if (that._checkFrameOrElement) {
                    // noinspection JSUnresolvedFunction
                    return that._ensureFrameVisible().then(fc => {
                        // FIXME - Scaling should be handled in a single place instead
                        // noinspection JSUnresolvedFunction
                        return that._updateScalingParams().then(scaleProviderFactory => {
                            let screenshotImage;
                            return that._imageProvider.getImage().then(screenshotImage_ => {
                                screenshotImage = screenshotImage_;
                                return that._debugScreenshotsProvider.save(screenshotImage_, "checkFullFrameOrElement");
                            }).then(() => {
                                const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
                                // TODO: do we need to scale the image? We don't do it in Java
                                return screenshotImage.scale(scaleProvider.getScaleRatio());
                            }).then(screenshotImage_ => {
                                screenshotImage = screenshotImage_;
                                const switchTo = that._driver.switchTo();
                                return switchTo.frames(fc);
                            }).then(() => {
                                const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, screenshotImage, that.getPromiseFactory());
                                return screenshot.init();
                            }).then(screenshot => {
                                that._logger.verbose("replacing regionToCheck");
                                that.setRegionToCheck(screenshot.getFrameWindow());
                            });
                        });
                    });
                }

                return that.getPromiseFactory().resolve(Region.EMPTY);
            }
        };

        return super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings).then(() => {
            that._checkFrameOrElement = false;
        });
    }

    /**
     * @private
     * @return {Promise.<FrameChain>}
     */
    _ensureFrameVisible() {
        const that = this;
        const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
        const fc = new FrameChain(this._logger, this._driver.getFrameChain());
        // noinspection JSValidateTypes
        return ensureFrameVisibleLoop(this._positionProvider, fc, this._driver.switchTo(), this.getPromiseFactory()).then(() => {
            return that._driver.switchTo().frames(originalFC);
        }).then(() => originalFC);
    }

    /**
     * @private
     * @param {WebElement} element
     * @return {Promise}
     */
    _ensureElementVisible(element) {
        if (!element) {
            // No element? we must be checking the window.
            return this.getPromiseFactory().resolve();
        }

        const originalFC = new FrameChain(this._logger, this._driver.getFrameChain());
        const switchTo = this._driver.switchTo();

        const that = this;
        let elementBounds;
        const eyesRemoteWebElement = new EyesWebElement(this._logger, this._driver, element);
        return eyesRemoteWebElement.getBounds().then(bounds => {
            const currentFrameOffset = originalFC.getCurrentFrameOffset();
            elementBounds = bounds.offset(currentFrameOffset.getX(), currentFrameOffset.getY());
            return that._getViewportScrollBounds();
        }).then(viewportBounds => {
            if (!viewportBounds.contains(elementBounds)) {
                let elementLocation;
                return that._ensureFrameVisible().then(() => {
                    return element.getLocation();
                }).then(p => {
                    elementLocation = new Location(p.x, p.y);

                    if (originalFC.size() > 0 && !EyesWebElement.equals(element, originalFC.peek().getReference())) {
                        return switchTo.frames(originalFC);
                    }
                }).then(() => {
                    return that._positionProvider.setPosition(elementLocation);
                });
            }
        });
    }

    /**
     * @private
     * @return {Promise.<Region>}
     */
    _getViewportScrollBounds() {
        const that = this;
        const originalFrameChain = new FrameChain(this._logger, this._driver.getFrameChain());
        const switchTo = this._driver.switchTo();
        return switchTo.defaultContent().then(() => {
            const spp = new ScrollPositionProvider(that._logger, that._jsExecutor);
            return spp.getCurrentPosition().then(location => {
                return that.getViewportSize().then(size => {
                    const viewportBounds = new Region(location, size);
                    return switchTo.frames(originalFrameChain).then(() => viewportBounds);
                });
            });
        });
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkRegion(name, checkSettings) {
        const that = this;

        const RegionProviderImpl = class RegionProviderImpl extends RegionProvider {
            // noinspection JSUnusedGlobalSymbols
            /** @override */
            getRegion () {
                return that._targetElement.getLocation().then(p => {
                    return that._targetElement.getSize().then(d => {
                        return new Region(Math.ceil(p.x), Math.ceil(p.y), d.width, d.height, CoordinatesType.CONTEXT_RELATIVE);
                    });
                });
            }
        };

        return super.checkWindowBase(new RegionProviderImpl(), name, false, checkSettings).then(() => {
            that._logger.verbose("Done! trying to scroll back to original position..");
        });
    }

    /**
     * @private
     * @return {Promise}
     */
    _checkElement(name, checkSettings) {
        const eyesElement = this._targetElement;
        const originalPositionProvider = this._positionProvider;
        const scrollPositionProvider = new ScrollPositionProvider(this._logger, this._jsExecutor);

        const that = this;
        let originalScrollPosition, originalOverflow, error;
        return scrollPositionProvider.getCurrentPosition().then(originalScrollPosition_ => {
            originalScrollPosition = originalScrollPosition_;
            return eyesElement.getLocation();
        }).then(pl => {
            that._checkFrameOrElement = true;

            let elementLocation, elementSize;
            return eyesElement.getComputedStyle("display").then(displayStyle => {
                if (displayStyle !== "inline") {
                    that._elementPositionProvider = new ElementPositionProvider(that._logger, that._driver, eyesElement);
                }
            }).then(() => {
                if (that._hideScrollbars) {
                    return eyesElement.getOverflow().then(originalOverflow_ => {
                        originalOverflow = originalOverflow_;
                        // Set overflow to "hidden".
                        return eyesElement.setOverflow("hidden");
                    });
                }
            }).then(() => {
                return eyesElement.getClientWidth().then(elementWidth => {
                    return eyesElement.getClientHeight().then(elementHeight => {
                        elementSize = new RectangleSize(elementWidth, elementHeight);
                    });
                });
            }).then(() => {
                return eyesElement.getComputedStyleInteger("border-left-width").then(borderLeftWidth => {
                    return eyesElement.getComputedStyleInteger("border-top-width").then(borderTopWidth => {
                        elementLocation = new Location(pl.x + borderLeftWidth, pl.y + borderTopWidth);
                    });
                });
            }).then(() => {
                const elementRegion = new Region(elementLocation, elementSize, CoordinatesType.CONTEXT_RELATIVE);

                that._logger.verbose("Element region: " + elementRegion);

                that._logger.verbose("replacing regionToCheck");
                that._regionToCheck = elementRegion;

                return super.checkWindowBase(new NullRegionProvider(this.getPromiseFactory()), name, false, checkSettings);
            });
        }).catch(error_ => {
            error = error_;
        }).then(() => {
            if (originalOverflow) {
                return eyesElement.setOverflow(originalOverflow);
            }
        }).then(() => {
            that._checkFrameOrElement = false;
            that._positionProvider = originalPositionProvider;
            that._regionToCheck = null;
            that._elementPositionProvider = null;

            return scrollPositionProvider.setPosition(originalScrollPosition);
        }).then(() => {
            if (error) {
                throw error;
            }
        });
    }

    /**
     * Updates the state of scaling related parameters.
     *
     * @protected
     * @return {Promise.<ScaleProviderFactory>}
     */
    _updateScalingParams() {
        // Update the scaling params only if we haven't done so yet, and the user hasn't set anything else manually.
        if (this._devicePixelRatio === Eyes.UNKNOWN_DEVICE_PIXEL_RATIO && this._scaleProviderHandler.get() instanceof NullScaleProvider) {
            this._logger.verbose("Trying to extract device pixel ratio...");

            const that = this;
            return EyesSeleniumUtils.getDevicePixelRatio(that._jsExecutor).then(ratio => {
                that._devicePixelRatio = ratio;
            }).catch(err => {
                that._logger.verbose("Failed to extract device pixel ratio! Using default.", err);
                that._devicePixelRatio = Eyes.DEFAULT_DEVICE_PIXEL_RATIO;
            }).then(() => {
                that._logger.verbose(`Device pixel ratio: ${that._devicePixelRatio}`);
                that._logger.verbose("Setting scale provider...");
                return that._getScaleProviderFactory();
            }).catch(err => {
                that._logger.verbose("Failed to set ContextBasedScaleProvider.", err);
                that._logger.verbose("Using FixedScaleProvider instead...");
                return new FixedScaleProviderFactory(1 / that._devicePixelRatio, that._scaleProviderHandler);
            }).then(factory => {
                that._logger.verbose("Done!");
                return factory;
            });
        }

        // If we already have a scale provider set, we'll just use it, and pass a mock as provider handler.
        const nullProvider = new SimplePropertyHandler();
        return this.getPromiseFactory().resolve(new ScaleProviderIdentityFactory(this._scaleProviderHandler.get(), nullProvider));
    }

    /**
     * @private
     * @return {Promise<ScaleProviderFactory>}
     */
    _getScaleProviderFactory() {
        const that = this;
        return this._positionProvider.getEntireSize().then(entireSize => {
            return new ContextBasedScaleProviderFactory(that._logger, entireSize, that._viewportSizeHandler.get(), that._devicePixelRatio, false, that._scaleProviderHandler);
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches it with the expected output.
     *
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {int} matchTimeout The amount of time to retry matching (Milliseconds).
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkWindow(tag, matchTimeout) {
        return this.check(tag, Target.window().timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
     *
     * @param {EyesWebElement} element The element which is the frame to switch to. (as
     * would be used in a call to driver.switchTo().frame() ).
     * @param {int} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkFrame(element, matchTimeout, tag) {
        return this.check(tag, Target.frame(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     *
     * @param {WebElement|EyesWebElement} element The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkElement(element, matchTimeout, tag) {
        return this.check(tag, Target.region(element).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     *
     * @param {By} locator The element to check.
     * @param {int|null} matchTimeout The amount of time to retry matching (milliseconds).
     * @param {String} tag An optional tag to be associated with the match.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkElementBy(locator, matchTimeout, tag) {
        return this.check(tag, Target.region(locator).timeout(matchTimeout).fully());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {Region} region The region to validate (in screenshot coordinates).
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegion(region, tag, matchTimeout) {
        return this.check(tag, Target.region(region).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {WebElement|EyesWebElement} element The element defining the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionByElement(element, tag, matchTimeout) {
        return this.check(tag, Target.region(element).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Visually validates a region in the screenshot.
     *
     * @param {By} by The WebDriver selector used for finding the region to validate.
     * @param {String} tag An optional tag to be associated with the screenshot.
     * @param {int} matchTimeout The amount of time to retry matching.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionBy(by, tag, matchTimeout) {
        return this.check(tag, Target.region(by).timeout(matchTimeout));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by the given selector.
     *
     * @param {String} frameNameOrId The name or id of the frame to switch to. (as would be used in a call to driver.switchTo().frame()).
     * @param {By} locator A Selector specifying the region to check.
     * @param {int|null} matchTimeout The amount of time to retry matching. (Milliseconds)
     * @param {String} tag An optional tag to be associated with the snapshot.
     * @param {boolean} stitchContent If {@code true}, stitch the internal content of the region (i.e., perform {@link #checkElement(By, int, String)} on the region.
     * @return {Promise} A promise which is resolved when the validation is finished.
     */
    checkRegionInFrame(frameNameOrId, locator, matchTimeout, tag, stitchContent) {
        return this.check(tag, Target.region(locator, frameNameOrId).timeout(matchTimeout).stitchContent(stitchContent));
    }

    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {Region} control The control on which the trigger is activated (context relative coordinates).
     * @param {Location} cursor  The cursor's position relative to the control.
     */
    addMouseTrigger(action, control, cursor) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return;
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`);
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return;
        }

        super.addMouseTriggerBase(action, control, cursor);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {WebElement} element The WebElement on which the click was called.
     * @return {Promise}
     */
    addMouseTriggerForElement(action, element) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${action} (disabled)`);
            return this.getPromiseFactory().resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${action} (no screenshot)`);
            return this.getPromiseFactory().resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${action} (different frame)`);
            return this.getPromiseFactory().resolve();
        }

        ArgumentGuard.notNull(element, "element");

        let p1;
        return element.getLocation().then(loc => {
            p1 = loc;
            return element.getSize();
        }).then(ds => {
            const elementRegion = new Region(p1.x, p1.y, ds.width, ds.height);
            super.addMouseTriggerBase(action, elementRegion, elementRegion.getMiddleOffset());
        });
    }

    /**
     * Adds a keyboard trigger.
     *
     * @param {Region} control The control on which the trigger is activated (context relative coordinates).
     * @param {String} text  The trigger's text.
     */
    addTextTrigger(control, text) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${text} (disabled)`);
            return;
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${text} (no screenshot)`);
            return;
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${text} (different frame)`);
            return;
        }

        super.addTextTriggerBase(control, text);
    }

    /**
     * Adds a keyboard trigger.
     *
     * @param {EyesWebElement} element The element for which we sent keys.
     * @param {String} text  The trigger's text.
     * @return {Promise}
     */
    addTextTriggerForElement(element, text) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`Ignoring ${text} (disabled)`);
            return this.getPromiseFactory().resolve();
        }

        // Triggers are actually performed on the previous window.
        if (!this._lastScreenshot) {
            this._logger.verbose(`Ignoring ${text} (no screenshot)`);
            return this.getPromiseFactory().resolve();
        }

        if (!FrameChain.isSameFrameChain(this._driver.getFrameChain(), this._lastScreenshot.getFrameChain())) {
            this._logger.verbose(`Ignoring ${text} (different frame)`);
            return this.getPromiseFactory().resolve();
        }

        ArgumentGuard.notNull(element, "element");

        return element.getLocation().then(p1 => {
            return element.getSize().then(ds => {
                const elementRegion = new Region(Math.ceil(p1.x), Math.ceil(p1.y), ds.width, ds.height);
                super.addTextTrigger(elementRegion, text);
            });
        });
    }

    /**
     * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
     *
     * @override
     * @inheritDoc
     */
    getViewportSize() {
        let viewportSize = this._viewportSizeHandler.get();
        if (viewportSize) {
            return this.getPromiseFactory().resolve(viewportSize);
        }

        return this._driver.getDefaultContentViewportSize();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Use this method only if you made a previous call to {@link #open(WebDriver, String, String)} or one of its variants.
     *
     * @protected
     * @override
     */
    setViewportSize(viewportSize) {
        if (this._viewportSizeHandler instanceof ReadOnlyPropertyHandler) {
            this._logger.verbose("Ignored (viewport size given explicitly)");
            return;
        }

        ArgumentGuard.notNull(viewportSize, "viewportSize");

        const that = this;
        const originalFrame = this._driver.getFrameChain();
        return this._driver.switchTo().defaultContent().then(() => {
            return EyesSeleniumUtils.setViewportSize(that._logger, that._driver, new RectangleSize(viewportSize)).catch(err => {
                // Just in case the user catches that error
                return that._driver.switchTo().frames(originalFrame).then(() => {
                    throw new TestFailedError("Failed to set the viewport size", err);
                });
            });
        }).then(() => {
            return that._driver.switchTo().frames(originalFrame);
        }).then(() => {
            that._viewportSizeHandler.set(new RectangleSize(viewportSize));
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {EyesWebDriver} driver The driver to use for getting the viewport.
     * @return {Promise.<RectangleSize>} The viewport size of the current context.
     */
    static getViewportSize(driver) {
        ArgumentGuard.notNull(driver, "driver");
        return EyesSeleniumUtils.getViewportSizeOrDisplaySize(new Logger(), driver);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Set the viewport size using the driver. Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     *
     * @param {EyesWebDriver} driver The driver to use for setting the viewport.
     * @param {RectangleSize} viewportSize The required viewport size.
     * @return {Promise}
     */
    static setViewportSize(driver, viewportSize) {
        ArgumentGuard.notNull(driver, "driver");
        ArgumentGuard.notNull(viewportSize, "viewportSize");

        return EyesSeleniumUtils.setViewportSize(new Logger(), driver, new RectangleSize(viewportSize));
    }

    /** @override */
    beforeOpen() {
        return this._tryHideScrollbars();
    }

    /** @override */
    beforeMatchWindow() {
        return this._tryHideScrollbars();
    }

    /**
     * @private
     * @return {Promise}
     */
    _tryHideScrollbars() {
        if (this._hideScrollbars) {
            const that = this;
            const originalFC = new FrameChain(that._logger, that._driver.getFrameChain());
            const fc = new FrameChain(that._logger, that._driver.getFrameChain());
            return EyesSeleniumUtils.hideScrollbars(that._driver, 200).then(overflow => {
                that._originalOverflow = overflow;
                return that._tryHideScrollbarsLoop(fc);
            }).then(() => {
                return that._driver.switchTo().frames(originalFC);
            }).catch(err => {
                that._logger.log("WARNING: Failed to hide scrollbars! Error: " + err);
            });
        }

        return this.getPromiseFactory().resolve();
    }

    /**
     * @private
     * @param {FrameChain} fc
     * @return {Promise}
     */
    _tryHideScrollbarsLoop(fc) {
        if (fc.size() > 0) {
            const that = this;
            return that._driver.getRemoteWebDriver().switchTo().parentFrame().then(() => {
                const frame = fc.pop();
                return EyesSeleniumUtils.hideScrollbars(that._driver, 200);
            }).then(() => {
                return that._tryHideScrollbarsLoop(fc);
            });
        }

        return this.getPromiseFactory().resolve();
    }

    /**
     * @private
     * @return {Promise}
     */
    _tryRestoreScrollbars() {
        if (this._hideScrollbars) {
            const that = this;
            const originalFC = new FrameChain(that._logger, that._driver.getFrameChain());
            const fc = new FrameChain(that._logger, that._driver.getFrameChain());
            return that._tryRestoreScrollbarsLoop(fc).then(() => {
                return that._driver.switchTo().frames(originalFC);
            });
        }
    }

    /**
     * @private
     * @param {FrameChain} fc
     * @return {Promise}
     */
    _tryRestoreScrollbarsLoop(fc) {
        if (fc.size() > 0) {
            const that = this;
            return that._driver.getRemoteWebDriver().switchTo().parentFrame().then(() => {
                const frame = fc.pop();
                return frame.getReference().setOverflow(frame.getOriginalOverflow());
            }).then(() => {
                return that._tryRestoreScrollbarsLoop(fc);
            });
        }

        return this.getPromiseFactory().resolve();
    }

    /*
    /**
     * @protected
     * @return {Promise}
     * /
    _afterMatchWindow() {
        if (this.hideScrollbars) {
            try {
                EyesSeleniumUtils.setOverflow(this.driver, this.originalOverflow);
            } catch (EyesDriverOperationException e) {
                // Bummer, but we'll continue with the screenshot anyway :)
                logger.log("WARNING: Failed to revert overflow! Error: " + e.getMessage());
            }
        }
    }
    */

    //noinspection JSUnusedGlobalSymbols
    /**
     * @protected
     * @override
     */
    getScreenshot() {
        const that = this;
        that._logger.verbose("getScreenshot()");

        let result, scaleProviderFactory, originalBodyOverflow, error;
        return that._updateScalingParams().then(scaleProviderFactory_ => {
            scaleProviderFactory = scaleProviderFactory_;

            const screenshotFactory = new EyesWebDriverScreenshotFactory(that._logger, that._driver, that.getPromiseFactory());

            const originalFrameChain = new FrameChain(that._logger, that._driver.getFrameChain());
            const algo = new FullPageCaptureAlgorithm(that._logger, that._userAgent, that._jsExecutor, that.getPromiseFactory());
            const switchTo = that._driver.switchTo();

            if (that._checkFrameOrElement) {
                that._logger.verbose("Check frame/element requested");
                return switchTo.framesDoScroll(originalFrameChain).then(() => {
                    return algo.getStitchedRegion(
                        that._imageProvider, that._regionToCheck, that._positionProvider,
                        that.getElementPositionProvider(), scaleProviderFactory, that._cutProviderHandler.get(),
                        that.getWaitBeforeScreenshots(), that._debugScreenshotsProvider, screenshotFactory,
                        that.getStitchOverlap(), that._regionPositionCompensation
                    );
                }).then(entireFrameOrElement => {
                    that._logger.verbose("Building screenshot object...");
                    const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, entireFrameOrElement, that.getPromiseFactory());
                    return screenshot.initFromFrameSize(new RectangleSize(entireFrameOrElement.getWidth(), entireFrameOrElement.getHeight()));
                }).then(screenshot => {
                    result = screenshot;
                });

            }

            if (that._forceFullPageScreenshot || that._stitchContent) {
                that._logger.verbose("Full page screenshot requested.");

                // Save the current frame path.
                const originalFramePosition = originalFrameChain.size() > 0 ? originalFrameChain.getDefaultContentScrollPosition() : new Location(0, 0);

                return switchTo.defaultContent().then(() => {
                    return algo.getStitchedRegion(
                        that._imageProvider, Region.EMPTY, new ScrollPositionProvider(that._logger, this._jsExecutor),
                        that._positionProvider, scaleProviderFactory, that._cutProviderHandler.get(), that.getWaitBeforeScreenshots(),
                        that._debugScreenshotsProvider, screenshotFactory, that.getStitchOverlap(), that._regionPositionCompensation
                    ).then(fullPageImage => {
                        return switchTo.frames(originalFrameChain).then(() => {
                            const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, fullPageImage, that.getPromiseFactory());
                            return screenshot.init(null, originalFramePosition);
                        }).then(screenshot => {
                            result = screenshot;
                        });
                    });
                });
            }

            let screenshotImage;
            return that._ensureElementVisible(that._targetElement).then(() => {
                that._logger.verbose("Screenshot requested...");
                return that._imageProvider.getImage();
            }).then(screenshotImage_ => {
                screenshotImage = screenshotImage_;
                return that._debugScreenshotsProvider.save(screenshotImage, "original");
            }).then(() => {
                const scaleProvider = scaleProviderFactory.getScaleProvider(screenshotImage.getWidth());
                if (scaleProvider.getScaleRatio() !== 1) {
                    that._logger.verbose("scaling...");
                    return screenshotImage.scale(scaleProvider.getScaleRatio()).then(screenshotImage_ => {
                        screenshotImage = screenshotImage_;
                        return that._debugScreenshotsProvider.save(screenshotImage, "scaled");
                    });
                }
            }).then(() => {
                const cutProvider = that._cutProviderHandler.get();
                if (!(cutProvider instanceof NullCutProvider)) {
                    that._logger.verbose("cutting...");
                    return cutProvider.cut(screenshotImage).then(screenshotImage_ => {
                        screenshotImage = screenshotImage_;
                        return that._debugScreenshotsProvider.save(screenshotImage, "cut");
                    });
                }
            }).then(() => {
                that._logger.verbose("Creating screenshot object...");
                const screenshot = new EyesWebDriverScreenshot(that._logger, that._driver, screenshotImage, that.getPromiseFactory());
                return screenshot.init();
            }).then(screenshot => {
                result = screenshot;
            });
        }).catch(error_ => {
            error = error_;
        }).then(() => {
            if (originalBodyOverflow) {
                return EyesSeleniumUtils.setBodyOverflow(that._jsExecutor, originalBodyOverflow);
            }
        }).then(() => {
            if (error) {
                throw error;
            }

            that._logger.verbose("Done!");
            return result;
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /** @override */
    getTitle() {
        const that = this;
        if (!this._dontGetTitle) {
            return that._driver.getTitle().catch(err => {
                that._logger.verbose("failed (" + err + ")");
                that._dontGetTitle = true;
                return "";
            });
        }

        return this.getPromiseFactory().resolve("");
    }

    // noinspection JSUnusedGlobalSymbols
    /** @override */
    getInferredEnvironment() {
        return this._driver.getUserAgent().then(userAgent => "useragent:" + userAgent).catch(() => null);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the failure report.
     * @param {FailureReports} mode Use one of the values in FailureReports.
     */
    setFailureReport(mode) {
        if (mode === FailureReports.IMMEDIATE) {
            this._failureReportOverridden = true;
            mode = FailureReports.ON_CLOSE;
        }

        super.setFailureReport(mode);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the image rotation degrees.
     * @param degrees The amount of degrees to set the rotation to.
     * @deprecated use {@link setRotation} instead
     */
    setForcedImageRotation(degrees) {
        this.setRotation(new ImageRotation(degrees))
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the rotation degrees.
     * @return {number} The rotation degrees.
     * @deprecated use {@link getRotation} instead
     */
    getForcedImageRotation() {
        return this.getRotation().getRotation();
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the session id.
     * @return {Promise} A promise which resolves to the webdriver's session ID.
     */
    getAUTSessionId() {
        return this.getPromiseFactory().makePromise(resolve => {
            if (!this._driver) {
                resolve(undefined);
                return;
            }
            this._driver.getSession().then(session => {
                resolve(session.getId());
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {PositionProvider} The currently set position provider.
     */
    getElementPositionProvider() {
        return this._elementPositionProvider ? this._elementPositionProvider : this._positionProvider;
    }
}

/**
 * @param positionProvider
 * @param frameChain
 * @param switchTo
 * @param promiseFactory
 * @return {Promise}
 */
function ensureFrameVisibleLoop(positionProvider, frameChain, switchTo, promiseFactory) {
    return promiseFactory.resolve().then(() => {
        if (frameChain.size() > 0) {
            return switchTo.parentFrame().then(() => {
                const frame = frameChain.pop();
                return positionProvider.setPosition(frame.getLocation());
            }).then(() => {
                return ensureFrameVisibleLoop(positionProvider, frameChain, switchTo, promiseFactory);
            });
        }
    });
}

Eyes.UNKNOWN_DEVICE_PIXEL_RATIO = 0;
Eyes.DEFAULT_DEVICE_PIXEL_RATIO = 1;
module.exports = Eyes;
