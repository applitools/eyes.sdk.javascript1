/* Type definitions for eyes.selenium 3.9.0 */
// Project: https://github.com/applitools/eyes.sdk.javascript
// Definitions by: Applitools Team <https://applitools.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.6 

///<reference types="node"/>

import { WebDriver, WebElement, By, TargetLocator, WebElementPromise, AlertPromise, promise } from 'selenium-webdriver';

import {ArgumentGuard, GeneralUtils, GeometryUtils, ImageDeltaCompressor, ImageUtils, StreamUtils, PropertyHandler, SimplePropertyHandler, ReadOnlyPropertyHandler, Region, RectangleSize, PromiseFactory, Location, UserAgent} from '@applitools/eyes-common-legacy';

import {EyesBase, ImageProvider, ConsoleLogHandler, ContextBasedScaleProvider, ContextBasedScaleProviderFactory, CoordinatesType, CutProvider, EyesScreenshot, FileLogHandler, FixedCutProvider, FixedScaleProvider, FixedScaleProviderFactory, Logger, LogHandler, MatchSettings, MutableImage, NullCutProvider, NullLogHandler, NullScaleProvider, PositionProvider, RegionProvider, ScaleProvider, ScaleProviderFactory, ScaleProviderIdentityFactory, ServerConnector, TestResultsFormatter, Triggers, Trigger, RunningSession, BatchInfo, AppEnvironment, SessionStartInfo, TestResults
} from '@applitools/eyes-sdk-core-legacy';

export interface FloatingRegion {
    left: number;
    top: number;
    width: number;
    height: number;
    maxLeftOffset: number;
    maxRightOffset: number;
    maxUpOffset: number;
    maxDownOffset: number;
}


export interface FloatingElement {
    element: WebElement|EyesRemoteWebElement|By;
    maxLeftOffset: number;
    maxRightOffset: number;
    maxUpOffset: number;
    maxDownOffset: number;
}


export declare class CssTranslatePositionProvider extends PositionProvider {
    constructor(logger: Logger, executor: EyesWebDriver, promiseFactory: PromiseFactory);
    /**
     * @return The scroll position of the current frame.
     */
    getCurrentPosition(): Promise<Location>;
    /**
     * Go to the specified location.
     * @param location The position to scroll to.
     */
    setPosition(location: Location): Promise<void>;
    /**
     * @return The entire size of the container which the position is relative to.
     */
    getEntireSize(): Promise<RectangleSize>;
    getState(): Promise<any>;
    /**
     * @param state The initial state of position
     */
    restoreState(state: any): Promise<void>;
}


export declare class ElementPositionProvider extends PositionProvider {
    constructor(logger: Logger, eyesDriver: EyesWebDriver, element: EyesRemoteWebElement, promiseFactory: PromiseFactory);
    /**
     * @return The scroll position of the current frame.
     */
    getCurrentPosition(): Promise<Location>;
    /**
     * Go to the specified location.
     * @param location The position to scroll to.
     */
    setPosition(location: Location): Promise<void>;
    /**
     * @return The entire size of the container which the position is relative to.
     */
    getEntireSize(): Promise<RectangleSize>;
    getState(): Promise<any>;
    /**
     * @param state The initial state of position
     */
    restoreState(state: any): Promise<void>;
}


/**
 * The main type - to be used by the users of the library to access all functionality.
 */
export declare class Eyes extends EyesBase {
    /**
     * @param serverUrl The Eyes server URL.
     * @param isDisabled set to true to disable Applitools Eyes and use the webdriver directly.
     **/
    constructor(serverUrl?: string, isDisabled?: boolean);
    /**
     * Starts a test.
     * @param driver The web driver that controls the browser hosting the application under test.
     * @param appName The name of the application under test.
     * @param testName The test name.
     * @param viewportSize The required browser's viewport size (i.e., the visible part of the document's body) or to use the current window's viewport.
     * @return A wrapped WebDriver which enables Eyes trigger recording and frame handling.
     */
    open(driver: WebDriver, appName: string, testName: string, viewportSize?: RectangleSize): Promise<WebDriver>;
    /**
     * Ends the test.
     * @param [throwEx=true] If true, an exception will be thrown for failed/new tests.
     * @return The test results.
     */
    close(throwEx?: boolean): Promise<TestResults>;
    /**
     * Preform visual validation
     * @param name A name to be associated with the match
     * @param target Target instance which describes whether we want a window/region/frame
     * @return A promise which is resolved when the validation is finished.
     */
    check(name: string, target: Target): Promise<void>;
    /**
     * Takes a snapshot of the application under test and matches it with the expected output.
     * @param [tag=] An optional tag to be associated with the snapshot.
     * @param [matchTimeout=-1] The amount of time to retry matching (Milliseconds).
     * @return A promise which is resolved when the validation is finished.
     */
    checkWindow(tag?: string, matchTimeout?: number): Promise<void>;
    /**
     * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
     * @param element The element which is the frame to switch to. (as would be used in a call to driver.switchTo().frame()).
     * @param [matchTimeout=-1] The amount of time to retry matching (milliseconds).
     * @param [tag=] An optional tag to be associated with the match.
     * @return A promise which is resolved when the validation is finished.
     */
    checkFrame(element: EyesRemoteWebElement, matchTimeout?: number, tag?: string): Promise<void>;
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     * @param element The element to check.
     * @param [matchTimeout=-1] The amount of time to retry matching (milliseconds).
     * @param [tag=] An optional tag to be associated with the match.
     * @return A promise which is resolved when the validation is finished.
     */
    checkElement(element: WebElement|EyesRemoteWebElement, matchTimeout?: number, tag?: string): Promise<void>;
    /**
     * Takes a snapshot of the application under test and matches a specific element with the expected region output.
     * @param locator The element to check.
     * @param [matchTimeout=-1] The amount of time to retry matching (milliseconds).
     * @param [tag=] An optional tag to be associated with the match.
     * @return A promise which is resolved when the validation is finished.
     */
    checkElementBy(locator: By, matchTimeout?: number, tag?: string): Promise<void>;
    /**
     * Visually validates a region in the screenshot.
     * @param region The region to validate (in screenshot coordinates).
     * @param [tag=] An optional tag to be associated with the screenshot.
     * @param [matchTimeout=-1] The amount of time to retry matching.
     * @return A promise which is resolved when the validation is finished.
     */
    checkRegion(region: Region, matchTimeout?: number, tag?: string): Promise<void>;
    /**
     * Visually validates a region in the screenshot.
     * @param element The element defining the region to validate.
     * @param [tag=] An optional tag to be associated with the screenshot.
     * @param [matchTimeout=-1] The amount of time to retry matching.
     * @return A promise which is resolved when the validation is finished.
     */
    checkRegionByElement(element: WebElement|EyesRemoteWebElement, tag?: string, matchTimeout?: number): Promise<void>;
    /**
     * Visually validates a region in the screenshot.
     * @param by The WebDriver selector used for finding the region to validate.
     * @param [tag=] An optional tag to be associated with the screenshot.
     * @param [matchTimeout=-1] The amount of time to retry matching.
     * @return A promise which is resolved when the validation is finished.
     */
    checkRegionBy(by: By, tag?: string, matchTimeout?: number): Promise<void>;
    /**
     * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by the given selector.
     * @param frameNameOrId The name or id of the frame to switch to. (as would be used in a call to driver.switchTo().frame()).
     * @param locator A Selector specifying the region to check.
     * @param [matchTimeout=-1] The amount of time to retry matching (Milliseconds).
     * @param [tag=] An optional tag to be associated with the snapshot.
     * @param [stitchContent=true] If {@code true}, stitch the internal content of the region (i.e., perform {@link #checkElement(By, number, String)} on the region.
     * @return A promise which is resolved when the validation is finished.
     */
    checkRegionInFrame(frameNameOrId: string, locator: By, matchTimeout?: number, tag?: string, stitchContent?: boolean): Promise<void>;
    /**
     * Get an updated screenshot.
     * @return The image of the new screenshot.
     */
    getScreenShot(): Promise<EyesScreenshot>;
    getTitle(): Promise<string>;
    getInferredEnvironment(): Promise<string>;
    /**
     * Set the failure report.
     * @param mode Use one of the values in EyesBase.FailureReport.
     */
    setFailureReport(mode: EyesBase.FailureReport): void;
    /**
     * Get the viewport size.
     * @return The viewport size.
     */
    getViewportSize(): Promise<RectangleSize>;
    setViewportSize(size: RectangleSize): Promise<void>;
    /**
     * Set the viewport size using the driver. Call this method if for some reason you don't want to call {@link #open(WebDriver, String, String)} (or one of its variants) yet.
     * @param driver The driver to use for setting the viewport.
     * @param size The required viewport size.
     * @return The viewport size of the browser.
     */
    static setViewportSize(driver: WebDriver, size: RectangleSize): Promise<void>;
    /**
     * Set the full page screenshot option.
     * @param force Whether to force a full page screenshot or not.
     */
    setForceFullPageScreenshot(force: boolean): void;
    /**
     * Get whether to force a full page screenshot or not.
     * @return true if the option is on, otherwise false.
     */
    getForceFullPageScreenshot(): boolean;
    /**
     * Set the image rotation degrees.
     * @param degrees The amount of degrees to set the rotation to.
     */
    setForcedImageRotation(degrees: number): void;
    /**
     * Get the rotation degrees.
     * @return The rotation degrees.
     */
    getForcedImageRotation(): number;
    /**
     * Hide the scrollbars when taking screenshots.
     * @param hide Whether to hide the scrollbars or not.
     */
    setHideScrollbars(hide: boolean): void;
    /**
     * Hide the scrollbars when taking screenshots.
     * @return true if the hide scrollbars option is on, otherwise false.
     */
    getHideScrollbars(): boolean;
    /**
     * Receives a selector and when doing hideScrollbars, it will set the overflow to hidden on that element.
     * @param element The element to hide scrollbars.
     */
    setScrollRootElement(element: WebElement|By|EyesRemoteWebElement): void;
    /**
     * Receives a selector and when doing hideScrollbars, it will set the overflow to hidden on that element.
     * @return The element to hide scrollbars.
     */
    getScrollRootElement(): WebElement;
    /**
     * Set the stitch mode.
     * @param mode The desired stitch mode settings.
     */
    setStitchMode(mode: Eyes.StitchMode): void;
    /**
     * Get the stitch mode.
     * @return The currently set StitchMode.
     */
    getStitchMode(): Eyes.StitchMode;
    /**
     * Sets the wait time between before each screen capture, including between screen parts of a full page screenshot.
     * @param waitBeforeScreenshots The wait time in milliseconds.
     */
    setWaitBeforeScreenshots(waitBeforeScreenshots: number): void;
    /**
     * Get the wait time before each screenshot.
     * @return the wait time between before each screen capture, in milliseconds.
     */
    getWaitBeforeScreenshots(): number;
    /**
     * Get the session id.
     * @return A promise which resolves to the webdriver's session ID.
     */
    getAUTSessionId(): Promise<void>;
}

export declare namespace Eyes {
    export enum StitchMode {
        /** Uses scrolling to get to the different parts of the page. */
        Scroll = 'Scroll',
        /** Uses CSS transitions to get to the different parts of the page. */
        CSS = 'CSS'
    }
}

// /**
//  * Wraps Protractor's ElementFinder to make sure we return our own Web Element.
//  */
// export declare class ElementFinderWrapper extends ElementFinder {
//     constructor(finder: ElementFinder, eyesDriver: EyesWebDriver, logger: Logger);
//     /**
//      * Wrap the getWebElement function
//      */
//     getWebElement(): EyesRemoteWebElement;
//     /**
//      * Wrap the click function
//      */
//     click(): promise.Promise<void>;
//     /**
//      * Wrap the functions that return objects that require pre-wrapping
//      */
//     sendKeys(): promise.Promise<void>;
// }


// /**
//  * Wrapper for ElementArrayFinder object from Protractor
//  */
// export declare class ElementArrayFinderWrapper extends ElementArrayFinder {
//     constructor(arrayFinder: ElementArrayFinder, eyesDriver: EyesWebDriver, logger: Logger);
// }


export declare class EyesRegionProvider extends RegionProvider {
    constructor(logger: Logger, driver: EyesWebDriver, region: Region, coordinatesType: CoordinatesType);
    /**
     * @return A region with "as is" viewport coordinates.
     */
    getRegion(): Region;
    /**
     * @return A region in selected viewport coordinates.
     */
    getRegionInLocation(image: MutableImage, toCoordinatesType: CoordinatesType, promiseFactory: PromiseFactory): Promise<Region>;
    /**
     * @return The type of coordinates on which the region is based.
     */
    getCoordinatesType(): CoordinatesType;
}


export declare class EyesRemoteWebElement extends WebElementPromise {
    constructor(remoteWebElement: WebElement, eyesDriver: EyesWebDriver, logger: Logger);
    static registerSendKeys(element: EyesRemoteWebElement, eyesDriver: EyesWebDriver, logger: Logger, args: any[]): Promise<void>;
    static registerClick(element: EyesRemoteWebElement, eyesDriver: EyesWebDriver, logger: Logger): Promise<void>;
    sendKeys(...var_args: any[]): promise.Promise<void>;
    click(): promise.Promise<void>;
    findElement(locator: By|object): EyesRemoteWebElement;
    findElements(locator: By|object): promise.Promise<EyesRemoteWebElement[]>;
    /**
     * Returns the computed value of the style property for the current element.
     * @param propStyle The style property which value we would like to extract.
     * @return The value of the style property of the element, or {@code null}.
     */
    getComputedStyle(propStyle: string): Promise<string>;
    /**
     * Returns the computed value of the style property for the current element.
     * @param propStyle The style property which value we would like to extract.
     * @return The integer value of a computed style.
     */
    getComputedStyleInteger(propStyle: string): Promise<number>;
    /**
     * @return The value of the scrollLeft property of the element.
     */
    getScrollLeft(): Promise<number>;
    /**
     * @return The value of the scrollTop property of the element.
     */
    getScrollTop(): Promise<number>;
    /**
     * @return The value of the scrollWidth property of the element.
     */
    getScrollWidth(): Promise<number>;
    /**
     * @return The value of the scrollHeight property of the element.
     */
    getScrollHeight(): Promise<number>;
    /**
     * @return The width of the left border.
     */
    getBorderLeftWidth(): Promise<number>;
    /**
     * @return The width of the right border.
     */
    getBorderRightWidth(): Promise<number>;
    /**
     * @return The width of the top border.
     */
    getBorderTopWidth(): Promise<number>;
    /**
     * @return The width of the bottom border.
     */
    getBorderBottomWidth(): Promise<number>;
    /**
     * @return element's size
     */
    getSize(): promise.Promise<RectangleSize>;
    /**
     * @return element's location
     */
    getLocation(): promise.Promise<Location>;
    /**
     * Scrolls to the specified location inside the element.
     * @param location The location to scroll to.
     */
    scrollTo(location: Location): Promise<void>;
    /**
     * @return The overflow of the element.
     */
    getOverflow(): Promise<string>;
    /**
     * @return The original element object
     */
    getRemoteWebElement(): Promise<WebElement>;
}


/**
 * A wrapper for an action to be performed before the actual switch is made.
 */
interface OnWillSwitch {
    /**
     * Will be called before switching into a frame.
     * @param {TargetType} targetType The type of frame we're about to switch into.
     * @param {WebElement} targetFrame The element about to be switched to, if available. Otherwise, null.
     */
    willSwitchToFrame(targetType: TargetType, targetFrame: WebElement): void;
    /**
     * Will be called before switching into a window.
     * @param {string} nameOrHandle The name/handle of the window to be switched to.
     */
    willSwitchToWindow(nameOrHandle: string): void;
}


export declare class EyesTargetLocator extends TargetLocator {
    /**
     * @param logger A Logger instance.
     * @param driver The WebDriver from which the targetLocator was received.
     * @param targetLocator The actual TargetLocator object.
     * @param onWillSwitch A delegate to be called whenever a relevant switch
     * @param promiseFactory
     */
    constructor(logger: Logger, driver: EyesWebDriver, targetLocator: TargetLocator, onWillSwitch: OnWillSwitch, promiseFactory: PromiseFactory);
    frame(nameOrIndex: number|EyesRemoteWebElement): promise.Promise<void>;
    parentFrame(): Promise<void>;
    /**
     * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
     * @param obj The path to the frame to switch to. Or the path to the frame to check. This is a list of frame names/IDs (where each frame is nested in the previous frame).
     * @return The WebDriver with the switched context.
     */
    frames(obj: FrameChain|string[]): Promise<void>;
    window(nameOrHandle: string): promise.Promise<void>;
    defaultContent(): promise.Promise<void>;
    activeElement(): EyesRemoteWebElement;
    alert(): AlertPromise;
}

export declare enum TargetType {
    FRAME = 1,
    PARENT_FRAME = 2,
    DEFAULT_CONTENT = 3
}

// EyesTargetLocator.TargetType = TargetType;

export declare class EyesWebDriver extends WebDriver {
    constructor(remoteWebDriver: WebDriver, eyes: Eyes, logger: Logger);
    getEyes(): Eyes;
    getPromiseFactory(): PromiseFactory;
    getRemoteWebDriver(): WebDriver;
    setRemoteWebDriver(driver: WebDriver): void;
    getUserAgent(): Promise<string>;
    findElement(locator: By|object): EyesRemoteWebElement;
    findElements(locator: By|object): promise.Promise<EyesRemoteWebElement[]>;
    findElementByCssSelector(cssSelector: string): EyesRemoteWebElement;
    findElementsByCssSelector(cssSelector: string): Promise<EyesRemoteWebElement[]>;
    findElementById(name: string): EyesRemoteWebElement;
    findElementsById(name: string): Promise<EyesRemoteWebElement[]>;
    findElementByName(name: string): EyesRemoteWebElement;
    findElementsByName(name: string): Promise<EyesRemoteWebElement[]>;
    switchTo(): EyesTargetLocator;
    /**
     * @param forceQuery If true, we will perform the query even if we have a cached viewport size.
     * @return The viewport size of the default content (outer most frame).
     */
    getDefaultContentViewportSize(forceQuery: boolean): Promise<RectangleSize>;
    /**
     * @return A copy of the current frame chain.
     */
    getFrameChain(): FrameChain;
}


export declare enum ScreenshotType {
    VIEWPORT = 1,
    ENTIRE_FRAME = 2
}


export declare class FirefoxScreenshotImageProvider implements ImageProvider {
    constructor(eyes: Eyes, logger: Logger, tsInstance: EyesWebDriver);
    getImage(): Promise<MutableImage>;
}


export declare class SafariScreenshotImageProvider implements ImageProvider {
    constructor(eyes: Eyes, logger: Logger, tsInstance: EyesWebDriver, userAgent: UserAgent);
    getImage(): Promise<MutableImage>;
}


export declare class TakesScreenshotImageProvider implements ImageProvider {
    constructor(logger: Logger, tsInstance: EyesWebDriver);
    getImage(): Promise<MutableImage>;
}


export declare class ImageProviderFactory {
    static getImageProvider(userAgent: UserAgent, eyes: Eyes, logger: Logger, driver: EyesWebDriver): ImageProvider;
}


export declare class EyesWebDriverScreenshot extends EyesScreenshot {
    /**
     * @param logger A Logger instance.
     * @param driver The web driver used to get the screenshot.
     * @param image The actual screenshot image.
     * @param promiseFactory
     */
    constructor(logger: Logger, driver: EyesWebDriver, image: MutableImage, promiseFactory: PromiseFactory);
    /**
     * @param screenshotType The screenshot's type (e.g., viewport/full page).
     * @param frameLocationInScreenshot The current frame's location in the screenshot.
     * @param frameSize The full internal size of the frame.
     */
    buildScreenshot(screenshotType?: ScreenshotType, frameLocationInScreenshot?: Location, frameSize?: RectangleSize): Promise<void>;
    /**
     * @return The region of the frame which is available in the screenshot, in screenshot coordinates.
     */
    getFrameWindow(): Region;
    /**
     * @return A copy of the frame chain which was available when the screenshot was created.
     */
    getFrameChain(): FrameChain;
    /**
     * Returns a part of the screenshot based on the given region.
     * @param region The region for which we should get the sub screenshot.
     * @param coordinatesType How should the region be calculated on the screenshot image.
     * @param throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
     * @return A screenshot instance containing the given region.
     */
    getSubScreenshot(region: Region, coordinatesType: CoordinatesType, throwIfClipped: boolean): Promise<EyesWebDriverScreenshot>;
    /**
     * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
     * @param location The location which coordinates needs to be converted.
     * @param from The current coordinates type for {@code location}.
     * @param to The target coordinates type for {@code location}.
     * @return A new location which is the transformation of {@code location} to the {@code to} coordinates type.
     */
    convertLocationFromLocation(location: Location, from: CoordinatesType, to: CoordinatesType): Location;
    getLocationInScreenshot(location: Location, coordinatesType: CoordinatesType): Location;
    getIntersectedRegion(region: Region, originalCoordinatesType: CoordinatesType, resultCoordinatesType: CoordinatesType): Region;
    /**
     * Gets the elements region in the screenshot.
     * @param element The element which region we want to intersect.
     * @return The intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
     */
    getIntersectedRegionFromElement(element: WebElement): Promise<Region>;
}


export declare class Frame {
    /**
     * @param logger A Logger instance.
     * @param reference The web element for the frame, used as a reference to switch into the frame.
     * @param frameId The id of the frame. Can be used later for comparing two frames.
     * @param location The location of the frame within the current frame.
     * @param size The frame element size (i.e., the size of the frame on the screen, not the internal document size).
     * @param parentScrollPosition The scroll position the frame's parent was in when the frame was switched to.
     */
    constructor(logger: Logger, reference: WebElement, frameId: string, location: Location, size: RectangleSize, parentScrollPosition: Location);
    getReference(): WebElement;
    getId(): string;
    getLocation(): Location;
    getSize(): RectangleSize;
    getParentScrollPosition(): Location;
}


export declare class FrameChain {
    /**
     * Creates a new frame chain.
     * @param logger A Logger instance.
     * @param other A frame chain from which the current frame chain will be created.
     */
    constructor(logger: Logger, other: FrameChain);
    /**
     * Compares two frame chains.
     * @param c1 Frame chain to be compared against c2.
     * @param c2 Frame chain to be compared against c1.
     * @return True if both frame chains represent the same frame, false otherwise.
     */
    static isSameFrameChain(c1: FrameChain, c2: FrameChain): boolean;
    /**
     * @return frames stored in chain
     */
    getFrames(): Frame[];
    /**
     * @param index Index of needed frame
     * @return frame by index in array
     */
    getFrame(index: number): Frame;
    /**
     * @return The number of frames in the chain.
     */
    size(): number;
    /**
     * Removes all current frames in the frame chain.
     */
    clear(): void;
    /**
     * Removes the last inserted frame element. Practically means we switched back to the parent of the current frame
     */
    pop(): Frame;
    /**
     * Appends a frame to the frame chain.
     * @param frame The frame to be added.
     */
    push(frame: Frame): void;
    /**
     * @return The location of the current frame in the page.
     */
    getCurrentFrameOffset(): Location;
    /**
     * @return The outermost frame's location, or NoFramesException.
     */
    getDefaultContentScrollPosition(): Location;
    /**
     * The size of the current frame.
     */
    getCurrentFrameSize(): RectangleSize;
}


export declare class ScrollPositionProvider extends PositionProvider {
    constructor(logger: Logger, executor: EyesWebDriver, promiseFactory: PromiseFactory);
    /**
     * @return The scroll position of the current frame.
     */
    getCurrentPosition(): Promise<Location>;
    /**
     * Go to the specified location.
     * @param location The position to scroll to.
     */
    setPosition(location: Location): Promise<void>;
    /**
     * @return The entire size of the container which the position is relative to.
     */
    getEntireSize(): Promise<RectangleSize>;
    getState(): Promise<Location>;
    /**
     * @param state The initial state of position
     */
    restoreState(state: Location): Promise<void>;
}


export declare class Target {
    constructor(region: Region|WebElement|EyesRemoteWebElement|By, frame: WebElement|EyesRemoteWebElement|String);
    /**
     * @param ms Milliseconds to wait
     */
    timeout(ms: number): Target;
    fully(stitchContent?: boolean): Target;
    ignoreMismatch(ignoreMismatch?: boolean): Target;
    matchLevel(matchLevel: MatchSettings.MatchLevel): Target;
    ignoreCaret(ignoreCaret?: boolean): Target;
    ignoreDisplacements(ignoreDisplacements?: boolean): Target;
    ignore(...ignoreRegion: (Region|WebElement|EyesRemoteWebElement|By|{element: (WebElement|EyesRemoteWebElement|By)})[]): Target;
    floating(...floatingRegion: (FloatingRegion|FloatingElement)[]): Target;
    getRegion(): Region|WebElement|EyesRemoteWebElement|By|null;
    isUsingRegion(): boolean;
    getFrame(): WebElement|EyesRemoteWebElement|String|null;
    isUsingFrame(): boolean;
    getTimeout(): number|null;
    getStitchContent(): boolean;
    getIgnoreMismatch(): boolean;
    getMatchLevel(): boolean;
    getIgnoreCaret(): boolean|null;
    getIgnoreDisplacements(): boolean|null;
    getIgnoreRegions(): Region[];
    getIgnoreObjects(): {element: (WebElement|EyesRemoteWebElement|By)}[];
    getFloatingRegions(): FloatingRegion[];
    getFloatingObjects(): FloatingElement[];
    /**
     * Validate current window
     */
    static window(): Target;
    /**
     * Validate region (in current window or frame) using region's rect, element or element's locator
     * @param region The region to validate.
     * @param frame The element which is the frame to switch to.
     */
    static region(region: Region|WebElement|EyesRemoteWebElement|By, frame?: WebElement|EyesRemoteWebElement|String): Target;
    /**
     * Validate frame
     * @param frame The element which is the frame to switch to.
     */
    static frame(frame: EyesRemoteWebElement|WebElement|String): Target;
}


export declare class EyesSeleniumUtils {
    /**
     * Executes a script using the browser's executeScript function - and optionally waits a timeout.
     * @param browser The driver using which to execute the script.
     * @param script The code to execute on the given driver.
     * @param promiseFactory
     * @param stabilizationTimeMs The amount of time to wait after script execution to let the browser a chance to stabilize (e.g., finish rendering).
     * @return A promise which resolves to the result of the script's execution on the tab.
     */
    static executeScript(browser: WebDriver, script: string, promiseFactory: PromiseFactory, stabilizationTimeMs?: number): Promise<void>;
    /**
     * Returns the computed value of the style property for the current element.
     * @param browser The driver which will execute the script to get computed style.
     * @param propStyle The style property which value we would like to extract.
     * @param element
     * @return The value of the style property of the element, or {@code null}.
     */
    static getComputedStyle(browser: WebDriver, element: WebElement, propStyle: string): Promise<string>;
    /**
     * Returns a location based on the given location.
     * @param logger The logger to use.
     * @param element The element for which we want to find the content's location.
     * @param location The location of the element.
     * @param promiseFactory
     * @return The location of the content of the element.
     */
    static getLocationWithBordersAddition(logger: Logger, element: WebElement|EyesRemoteWebElement, location: Location, promiseFactory: PromiseFactory): Promise<Location>;
    /**
     * Gets the device pixel ratio.
     * @param browser The driver which will execute the script to get the ratio.
     * @param promiseFactory
     * @return A promise which resolves to the device pixel ratio (float type).
     */
    static getDevicePixelRatio(browser: WebDriver, promiseFactory: PromiseFactory): Promise<number>;
    /**
     * Get the current transform of page.
     * @param browser The driver which will execute the script to get the scroll position.
     * @param promiseFactory
     * @return A promise which resolves to the current transform value.
     */
    static getCurrentTransform(browser: WebDriver, promiseFactory: PromiseFactory): Promise<any>;
    /**
     * Sets transforms for document.documentElement according to the given map of style keys and values.
     * @param browser The browser to use.
     * @param transforms The transforms to set. Keys are used as style keys and values are the values for those styles.
     * @param promiseFactory
     */
    static setTransforms(browser: WebDriver, transforms: any, promiseFactory: PromiseFactory): Promise<void>;
    /**
     * Set the given transform to document.documentElement for all style keys defined in JS_TRANSFORM_KEYS
     * @param browser The driver which will execute the script to set the transform.
     * @param transformToSet The transform to set.
     * @param promiseFactory
     * @return A promise which resolves to the previous transform once the updated transform is set.
     */
    static setTransform(browser: WebDriver, transformToSet: string, promiseFactory: PromiseFactory): Promise<void>;
    /**
     * CSS translate the document to a given location.
     * @param browser The driver which will execute the script to set the transform.
     * @param point
     * @param promiseFactory
     * @return A promise which resolves to the previous transform when the scroll is executed.
     */
    static translateTo(browser: WebDriver, point: Location, promiseFactory: PromiseFactory): Promise<void>;
    /**
     * Scroll to the specified position.
     * @param browser The driver which will execute the script to set the scroll position.
     * @param point
     * @param promiseFactory
     * @return A promise which resolves after the action is performed and timeout passed.
     */
    static scrollTo(browser: WebDriver, point: Location, promiseFactory: PromiseFactory): Promise<void>;
    /**
     * Gets the current scroll position.
     * @param browser The driver which will execute the script to get the scroll position.
     * @param promiseFactory
     * @return A promise which resolves to the current scroll position.
     */
    static getCurrentScrollPosition(browser: WebDriver, promiseFactory: PromiseFactory): Promise<Location>;
    /**
     * Get the entire page size.
     * @param browser The driver used to query the web page.
     * @param promiseFactory
     * @return A promise which resolves to an object containing the width/height of the page.
     */
    static getEntirePageSize(browser: WebDriver, promiseFactory: PromiseFactory): Promise<RectangleSize>;
    /**
     * Updates the document's documentElement "overflow" value (mainly used to remove/allow scrollbars).
     * @param browser The driver used to update the web page.
     * @param overflowValue The values of the overflow to set.
     * @param scrollRootElement
     * @param promiseFactory
     * @return A promise which resolves to the original overflow of the document.
     */
    static setOverflow(browser: WebDriver, overflowValue: string, scrollRootElement: WebElement, promiseFactory: PromiseFactory): Promise<string>;
    /**
     * Updates the document's body "overflow" value
     * @param browser The driver used to update the web page.
     * @param overflowValue The values of the overflow to set.
     * @param promiseFactory
     * @return A promise which resolves to the original overflow of the document.
     */
    static setBodyOverflow(browser: WebDriver, overflowValue: string, promiseFactory: PromiseFactory): Promise<string>;
    /**
     * Hides the scrollbars of the current context's document element.
     * @param browser The browser to use for hiding the scrollbars.
     * @param promiseFactory
     * @return The previous value of the overflow property (could be {@code null}).
     */
    static hideScrollbars(browser: WebDriver, promiseFactory: PromiseFactory): Promise<string>;
    /**
     * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
     * @param browser The browser to use.
     * @param promiseFactory
     * @return The viewport size.
     */
    static getViewportSize(browser: WebDriver, promiseFactory: PromiseFactory): Promise<RectangleSize>;
    /**
     * @param logger
     * @param browser The browser to use.
     * @param promiseFactory
     * @return The viewport size of the current context, or the display size if the viewport size cannot be retrieved.
     */
    static getViewportSizeOrDisplaySize(logger: Logger, browser: WebDriver, promiseFactory: PromiseFactory): Promise<RectangleSize>;
    /**
     * @param logger
     * @param browser The browser to use.
     * @param requiredSize
     * @param promiseFactory
     */
    static setBrowserSize(logger: Logger, browser: WebDriver, requiredSize: RectangleSize, promiseFactory: PromiseFactory): Promise<boolean>;
    /**
     * @param logger
     * @param browser The browser to use.
     * @param actualViewportSize
     * @param requiredViewportSize
     * @param promiseFactory
     */
    static setBrowserSizeByViewportSize(logger: Logger, browser: WebDriver, actualViewportSize: RectangleSize, requiredViewportSize: RectangleSize, promiseFactory: PromiseFactory): Promise<boolean>;
    /**
     * Tries to set the viewport
     * @param logger
     * @param browser The browser to use.
     * @param requiredSize The viewport size.
     * @param promiseFactory
     */
    static setViewportSize(logger: Logger, browser: WebDriver, requiredSize: RectangleSize, promiseFactory: PromiseFactory): Promise<void>;
    /**
     * Capture screenshot from given driver
     */
    static getScreenshot(
        browser: WebDriver,
        promiseFactory: PromiseFactory,
        imageProvider: ImageProvider,
        viewportSize: RectangleSize,
        positionProvider: PositionProvider,
        scaleProviderFactory: ScaleProviderFactory,
        cutProvider: CutProvider,
        fullPage: boolean,
        hideScrollbars: boolean,
        scrollRootElement: WebElement,
        useCssTransition: boolean,
        rotationDegrees: number,
        automaticRotation: boolean,
        automaticRotationDegrees: number,
        isLandscape: boolean,
        waitBeforeScreenshots: number,
        checkFrameOrElement: boolean,
        regionProvider?: RegionProvider,
        saveDebugScreenshots?: boolean,
        debugScreenshotsPath?: string
    ): Promise<MutableImage>;
}
