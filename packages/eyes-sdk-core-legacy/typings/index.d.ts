/* Type definitions for eyes.sdk 3.6.0 */
// Project: https://github.com/applitools/eyes.sdk.javascript
// Definitions by: Applitools Team <https://applitools.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="node"/>

import { PromiseFactory, PropertyHandler, Location, Region, RectangleSize } from 'eyes.utils';

export { ArgumentGuard, GeneralUtils, GeometryUtils, ImageDeltaCompressor, ImageUtils, PromiseFactory, StreamUtils,
    PropertyHandler, SimplePropertyHandler, ReadOnlyPropertyHandler, Location, Region, RectangleSize } from 'eyes.utils';

export interface Trigger {
    triggerType: Triggers.TriggerType,
    location: Location,
    mouseAction: Triggers.MouseAction,
    control: Region
}


export interface RunningSession {
    sessionId: string,
    legacySessionId?: string,
    sessionUrl: string,
    isNewSession: boolean
}


export interface BatchInfo {
    id: string,
    name: string,
    startedAt: string
}


export interface AppEnvironment {
    inferred: string,
    os: string,
    hostingApp: string,
    displaySize: RectangleSize
}


export interface SessionStartInfo {
    agentId: string,
    appIdOrName: string,
    scenarioIdOrName: string,
    batchInfo: BatchInfo,
    baselineEnvName: string,
    compareWithParentBranch: boolean,
    ignoreBaseline: boolean,
    environmentName: string,
    environment: AppEnvironment,
    defaultMatchSettings: { // TODO ImageMatchSettings
        matchLevel: MatchSettings.MatchLevel,
        ignoreCaret: boolean,
        ignoreDisplacements: boolean,
        accessibilitySettings: AccessibilitySettings,
        exact: {
            minDiffIntensity: number,
            minDiffWidth: number,
            minDiffHeight: number,
            matchThreshold: number
        }
    },
    branchName: string,
    parentBranchName: string,
    baselineBranchName: string,
    autSessionId: string,
    properties: object
}

export type AccessibilityLevel = "AA"|"AAA"
export type AccessibilityGuidelinesVersion = "WCAG_2_0"|"WCAG_2_1"
export type AccessibilityStatus = "Passed"|"Failed"
export type AccessibilityRegionType = "IgnoreContrast"|"RegularText"|"LargeText"|"BoldText"|"GraphicalObject"

export interface AccessibilitySettings {
  level: AccessibilityLevel
  guidelinesVersion: AccessibilityGuidelinesVersion
}

export interface SessionAccessibilityStatus {
  level: AccessibilityLevel,
  version: AccessibilityGuidelinesVersion,
  status: AccessibilityStatus
}

export interface TestResults {
    name: string,
    secretToken: string,
    status: EyesBase.TestResultsStatus,
    appName: string,
    batchName: string,
    batchId: string,
    branchName: string,
    hostOS: string,
    hostApp: string,
    hostDisplaySize: RectangleSize,
    startedAt: Date,
    duration: number,
    isNew: boolean,
    isDifferent: boolean,
    isAborted: boolean,
    appUrls: {batch: string, session: string},
    apiUrls: {batch: string, session: string},
    stepsInfo: {name: string, isDifferent: boolean, hasBaselineImage: boolean, hasCurrentImage: boolean, appUrls: {step: string}, apiUrls: {baselineImage: string, currentImage: string, diffImage: string}}[],
    steps: number,
    matches: number,
    mismatches: number,
    missing: number,
    exactMatches: number,
    strictMatches: number,
    contentMatches: number,
    layoutMatches: number,
    noneMatches: number,
    url: string,
    accessibilityStatus: SessionAccessibilityStatus
}


export declare enum CoordinatesType {
    /**
     * The coordinates should be used "as is" on the screenshot image.
     * Regardless of the current context.
     */
    SCREENSHOT_AS_IS = 1,

    /**
     * The coordinates should be used "as is" within the current context. For
     * example, if we're inside a frame, the coordinates are "as is",
     * but within the current frame's viewport.
     */
    CONTEXT_AS_IS = 2,

    /**
     * Coordinates are relative to the context. For example, if we are in
     * a context of a frame in a web page, then the coordinates are relative to
     * the  frame. In this case, if we want to crop an image region based on
     * an element's region, we will need to calculate their respective "as
     * is" coordinates.
     */
    CONTEXT_RELATIVE = 3
}


export declare class Logger {
    /**
     * Set the log handler
     */
    setLogHandler(logHandler: LogHandler): void;
    /**
     * Get the log handler
     */
    getLogHandler(): LogHandler;
    verbose(...args: string[]): void;
    log(...args: string[]): void;
}


/**
 * Handles log messages produces by the Eyes API.
 */
export declare abstract class LogHandler {
    /**
     * Whether to handle or ignore verbose log messages.
     */
    setIsVerbose(isVerbose: boolean): void;
    /**
     * Whether to handle or ignore verbose log messages.
     */
    getIsVerbose(): boolean;
    /**
     * If set to {@code true} then log output include session id, useful in multi-thread environment
     * @param [isPrintSessionId=false]
     */
    setPrintSessionId(isPrintSessionId: boolean): void;
    getIsPrintSessionId(): boolean;
    open(): boolean;
    close(): boolean;
    onMessage(verbose: boolean, logString: string): void;
}


/**
 * Ignores all log messages.
 */
export declare class NullLogHandler extends LogHandler {
}


/**
 * Write log massages to the browser/node console
 */
export declare class ConsoleLogHandler extends LogHandler {
    /**
     * @param isVerbose Whether to handle or ignore verbose log messages.
     */
    constructor(isVerbose: boolean);
    /**
     * Handle a message to be logged.
     * @param verbose - is the message verbose
     * @param logString The string to log.
     */
    onMessage(verbose: boolean, logString: string): void;
}


/**
 * Write log massages to the browser/node console
 */
export declare class FileLogHandler extends LogHandler {
    /**
     * @param isVerbose Whether to handle or ignore verbose log messages.
     * @param filename The file in which to save the logs.
     * @param append Whether to append the logs to existing file, or to overwrite the existing file.
     */
    constructor(isVerbose: boolean, filename?: string, append?: boolean);
    /**
     * @param fileName The name of the log file.
     */
    setFileName(fileName: string): void;
    /**
     * @return The name of the log file.
     */
    getFileName(): string;
    /**
     * @param fileDirectory The path of the log file folder.
     */
    setFileDirectory(fileDirectory: string): void;
    /**
     * @return The path of the log file folder.
     */
    getFileDirectory(): string;
    /**
     * Create a winston file logger
     */
    open(): boolean;
    /**
     * Close the winston file logger
     */
    close(): boolean;
    /**
     * Handle a message to be logged.
     * @param verbose Whether this message is flagged as verbose or not.
     * @param logString The string to log.
     */
    onMessage(verbose: boolean, logString: string): void;
}


export declare abstract class ScaleProvider {
    /**
     * @return The ratio by which an image will be scaled.
     */
    getScaleRatio(): number;
}


export declare class FixedScaleProvider extends ScaleProvider {
    /**
     * @param scaleRatio The scale ratio to use.
     */
    constructor(scaleRatio: number);
    /**
     * @return The ratio by which an image will be scaled.
     */
    getScaleRatio(): number;
}


/**
 * A scale provider which does nothing.
 */
export declare class NullScaleProvider extends FixedScaleProvider {
    constructor();
}


export declare class ContextBasedScaleProvider extends ScaleProvider {
    /**
     * @param topLevelContextEntireSize The total size of the top level context. E.g., for selenium this would be the document size of the top level frame.
     * @param viewportSize The viewport size.
     * @param devicePixelRatio The device pixel ratio of the platform on which the application is running.
     */
    constructor(topLevelContextEntireSize: RectangleSize, viewportSize: RectangleSize, devicePixelRatio: number);
    /**
     * @return The ratio by which an image will be scaled.
     */
    getScaleRatio(): number;
    /**
     * Set the scale ratio based on the given image.
     * @param imageToScaleWidth The width of the image to scale, used for calculating the scale ratio.
     */
    updateScaleRatio(imageToScaleWidth: number): void;
}


/**
 * Abstraction for instantiating scale providers.
 */
export declare abstract class ScaleProviderFactory {
    /**
     * @param scaleProviderHandler A handler to update once a {@link ScaleProvider} instance is created.
     **/
    protected constructor(scaleProviderHandler: PropertyHandler<ScaleProvider>);
    /**
     * The main API for this factory.
     * @param imageToScaleWidth The width of the image to scale. This parameter CAN be by class implementing the factory, but this is not mandatory.
     * @return A {@link ScaleProvider} instance.
     */
    getScaleProvider(imageToScaleWidth: number): ScaleProvider;
    /**
     * The implementation of getting/creating the scale provider, should be implemented by child classes.
     * @param imageToScaleWidth The width of the image to scale. This parameter CAN be by class implementing the factory, but this is not mandatory.
     * @return The scale provider to be used.
     */
    abstract getScaleProviderImpl(imageToScaleWidth: number): ScaleProvider;
}


export declare class ContextBasedScaleProviderFactory extends ScaleProviderFactory {
    /**
     * Factory implementation for creating {@link ContextBasedScaleProvider} instances.
     * @param topLevelContextEntireSize The total size of the top level context. E.g., for selenium this would be the document size of the top level frame.
     * @param viewportSize The viewport size.
     * @param devicePixelRatio The device pixel ratio of the platform on which the application is running.
     * @param scaleProviderHandler
     */
    constructor(topLevelContextEntireSize: RectangleSize, viewportSize: RectangleSize, devicePixelRatio: number, scaleProviderHandler: PropertyHandler<ScaleProvider>);
    /**
     * The implementation of getting/creating the scale provider, should be implemented by child classes.
     * @param imageToScaleWidth The width of the image to scale. This parameter CAN be by class implementing the factory, but this is not mandatory.
     * @return The scale provider to be used.
     */
    getScaleProviderImpl(imageToScaleWidth: number): ScaleProvider;
}


export declare class ScaleProviderIdentityFactory extends ScaleProviderFactory {
    /**
     * Factory implementation which simply returns the scale provider it is given as an argument.
     * @param scaleProvider The {@link ScaleProvider}
     * @param scaleProviderHandler A handler to update once a {@link ScaleProvider} instance is created.
     */
    constructor(scaleProvider: ScaleProvider, scaleProviderHandler: PropertyHandler<ScaleProvider>);
    /**
     * The implementation of getting/creating the scale provider, should be implemented by child classes.
     * @param imageToScaleWidth The width of the image to scale. This parameter CAN be by class implementing the factory, but this is not mandatory.
     * @return The scale provider to be used.
     */
    getScaleProviderImpl(imageToScaleWidth: number): ScaleProvider;
}


export declare class FixedScaleProviderFactory extends ScaleProviderFactory {
    /**
     * @param scaleRatio The scale ratio to use.
     * @param scaleProviderHandler
     */
    constructor(scaleRatio: number, scaleProviderHandler: PropertyHandler<ScaleProvider>);
    /**
     * The implementation of getting/creating the scale provider, should be implemented by child classes.
     * @param imageToScaleWidth The width of the image to scale. This parameter CAN be by class implementing the factory, but this is not mandatory.
     * @return The scale provider to be used.
     */
    getScaleProviderImpl(imageToScaleWidth: number): ScaleProvider;
}


export declare interface ImageProvider {
    getImage(): Promise<MutableImage>;
}


export declare abstract class CutProvider {
    /**
     * @param image The image to cut.
     * @param promiseFactory
     * @return A new cut image.
     */
    cut(image: MutableImage, promiseFactory: PromiseFactory): Promise<MutableImage>;
    /**
     * Get a scaled version of the cut provider.
     * @param scaleRatio The ratio by which to scale the current cut parameters.
     * @return A new scale cut provider instance.
     */
    scale(scaleRatio: number): CutProvider;
}


export declare class FixedCutProvider extends CutProvider {
    /**
     * @param header The header to cut in pixels.
     * @param footer The footer to cut in pixels.
     * @param left The left to cut in pixels.
     * @param right The right to cut in pixels.
     */
    constructor(header: number, footer: number, left: number, right: number);
    /**
     * @param image The image to cut.
     * @param promiseFactory
     * @return A new cut image.
     */
    cut(image: MutableImage, promiseFactory: PromiseFactory): Promise<MutableImage>;
    /**
     * Get a scaled version of the cut provider.
     * @param scaleRatio The ratio by which to scale the current cut parameters.
     * @return A new scale cut provider instance.
     */
    scale(scaleRatio: number): CutProvider;
}


/**
 * A scale provider which does nothing.
 */
export declare class NullCutProvider extends CutProvider {
    constructor();
}


export declare abstract class EyesScreenshot {
    protected constructor(image: MutableImage);
    /**
     * @return the screenshot image.
     */
    getImage(): MutableImage;
    /**
     * Returns a part of the screenshot based on the given region.
     * @param region The region for which we should get the sub screenshot. screenshot image.
     * @param coordinatesType
     * @param throwIfClipped Throw an EyesException if the region is not fully contained in the screenshot.
     * @return A screenshot instance containing the given region.
     */
    abstract getSubScreenshot(region: Region, coordinatesType: CoordinatesType, throwIfClipped: boolean): Promise<EyesScreenshot>;
    /**
     * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
     * @param location The location which coordinates needs to be converted.
     * @param from The current coordinates type for {@code location}.
     * @param to The target coordinates type for {@code location}.
     * @return A new location which is the transformation of {@code location} to the {@code to} coordinates type.
     */
    abstract convertLocationFromLocation(location: Location, from: CoordinatesType, to: CoordinatesType): Location;
    /**
     * Calculates the location in the screenshot of the location given as parameter.
     * @param location The location as coordinates inside the current frame.
     * @param coordinatesType The coordinates type of {@code location}.
     * @return The corresponding location inside the screenshot, in screenshot as-is coordinates type.
     * @throws If the location is not inside the frame's region in the screenshot.
     */
    abstract getLocationInScreenshot(location: Location, coordinatesType: CoordinatesType): Location;
    /**
     * Get the intersection of the given region with the screenshot.
     * @param region The region to intersect.
     * @param originalCoordinatesType The coordinates type of {@code region}.
     * @param resultCoordinatesType The coordinates type of the resulting region.
     * @return The intersected region, in {@code resultCoordinatesType} coordinates.
     */
    abstract getIntersectedRegion(region: Region, originalCoordinatesType: CoordinatesType, resultCoordinatesType: CoordinatesType): Region;
    /**
     * Converts a region's location coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
     * @param region The region which location's coordinates needs to be converted.
     * @param from The current coordinates type for {@code region}.
     * @param to The target coordinates type for {@code region}.
     * @return A new region which is the transformation of {@code region} to the {@code to} coordinates type.
     */
    convertRegionLocation(region: Region, from: CoordinatesType, to: CoordinatesType): Region;
}


export declare abstract class EyesSimpleScreenshot extends EyesScreenshot {
    protected constructor(image: MutableImage, location?: RectangleSize);
    /**
     * Get size of screenshot
     */
    getSize(): RectangleSize;
}


export declare abstract class PositionProvider {
    /**
     * @return The current position, or {@code null} if position is not available.
     */
    getCurrentPosition(): Promise<Location>;
    /**
     * Go to the specified location.
     * @param location The position to set.
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


export declare abstract class RegionProvider {
    protected constructor(region: Region, coordinatesType: CoordinatesType);
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


export declare class MatchWindowTask {
    /**
     * @param promiseFactory An object which will be used for creating deferreds/promises.
     * @param serverConnector Our gateway to the agent
     * @param runningSession The running session in which we should match the window
     * @param retryTimeout The default total time to retry matching (ms).
     * @param appOutputProvider A callback for getting the application output when performing match
     * @param waitTimeout a call back that provides timeout
     * @param logger
     **/
    constructor(promiseFactory: PromiseFactory, serverConnector: ServerConnector, runningSession: {sessionId: string, legacySessionId: string, sessionUrl: string, isNewSession: boolean}, retryTimeout: number, appOutputProvider: {appOutput: {screenShot64: string, title: string}, screenShot: {imageBuffer: Buffer, width: number, height: number}}, waitTimeout: () => any, logger: Logger);
    getLastScreenshotBounds(): Region;
    matchWindow(userInputs: Trigger[], lastScreenshot: {imageBuffer: Buffer, width: number, height: number}, regionProvider: RegionProvider, tag: string, shouldRunOnceOnRetryTimeout: boolean, ignoreMismatch: boolean, retryTimeout: number, imageMatchSettings: MatchSettings.ImageMatchSettings): Promise<TestResults>;
}

export declare class Triggers {
    static createMouseTrigger(mouseAction: Triggers.MouseAction, control: Region, location: Location): Trigger;
    static createTextTrigger(control: Region, text: string): Trigger;
}

export declare namespace Triggers {
    export enum TriggerType {
        Unknown = 'Unknown',
        Mouse = 'Mouse',
        Text = 'Text',
        Keyboard = 'Keyboard'
    }

    export enum MouseAction {
        None = 'None',
        Click = 'Click',
        RightClick = 'RightClick',
        DoubleClick = 'DoubleClick',
        Move = 'Move',
        Down = 'Down',
        Up = 'Up'
    }
}


export declare class TestResultsFormatter {
    /**
     * Adds an additional results object to the currently stored results list.
     * @param results A test results object as returned by a call to 'eyes.close' or 'eyes.abort'.
     * @returns The updated 'TestResultsFormatter' instance.
     */
    addResults(results: TestResults): TestResultsFormatter;
    /**
     * Creates a TAP representation of the tests results list in hierarchic format.
     * @param [includeSubTests] If true, steps will be treated as "subtests". Default is true.
     * @param [markNewAsPassed] If true, new tests will be treated as "passed". Default is false.
     * @return A string which is the TAP representation of the results list.
     */
    asHierarchicTAPString(includeSubTests?: boolean, markNewAsPassed?: boolean): string;
    /**
     * Creates a TAP representation of the tests results list in which each steps are colored as success/fail.
     * @param [markNewAsPassed] If true, new tests will be treated as "passed". Default is false.
     * @return A string which is the TAP representation of the results list.
     */
    asFlattenedTAPString(markNewAsPassed?: boolean): string;
}


export declare namespace MatchSettings {
    export enum MatchLevel {
        /** Images do not necessarily match. */
        None = 'None',
        /** Images have the same layout (legacy algorithm). */
        LegacyLayout = 'Layout1',
        /** Images have the same layout. */
        Layout = 'Layout2',
        /** Images have the same layout. */
        Layout2 = 'Layout2',
        /** Images have the same content. */
        Content = 'Content',
        /** Images are nearly identical. */
        Strict = 'Strict',
        /** Images are identical. */
        Exact = 'Exact'
    }

    /**
     * Encapsulate threshold settings for the "Exact" match level.
     */
    export class ExactMatchSettings {
        /**
         * @param [minDiffIntensity=0] The minimum intensity difference of pixel to be considered a change. Valid values are 0-255.
         * @param [minDiffWidth=0] The minimum width of an intensity filtered pixels cluster to be considered a change. Must be >= 0.
         * @param [minDiffHeight=0] The minimum height of an intensity filtered pixels cluster to be considered a change. Must be >= 0.
         * @param [matchThreshold=0] The maximum percentage(!) of different pixels (after intensity, width and height filtering) which is still considered as a match. Valid values are fractions between 0-1.
         */
        constructor(minDiffIntensity?: number, minDiffWidth?: number, minDiffHeight?: number, matchThreshold?: number);
        /**
         * @param [minDiffIntensity=0] The minimum intensity difference of pixel to be considered a change. Valid values are 0-255.
         */
        setMinDiffIntensity(minDiffIntensity?: number): void;
        /**
         * @return The minimum intensity difference of pixel to be considered a change.
         */
        getMinDiffIntensity(): number;
        /**
         * @param [minDiffWidth=0] The minimum width of an intensity filtered pixels cluster to be considered a change. Must be >= 0.
         */
        setMinDiffWidth(minDiffWidth?: number): void;
        /**
         * @return The minimum width of an intensity filtered pixels cluster to be considered a change.
         */
        getMinDiffWidth(): number;
        /**
         * @param [minDiffHeight=0] The minimum height of an intensity filtered pixels cluster to be considered a change. Must be >= 0.
         */
        setMinDiffHeight(minDiffHeight?: number): void;
        /**
         * @return The minimum width of an intensity filtered pixels cluster to be considered a change.
         */
        getMinDiffHeight(): number;
        /**
         * @param [matchThreshold=0] The maximum percentage(!) of different pixels (after intensity, width and height filtering) which is still considered as a match. Valid values are fractions between 0-1.
         */
        setMatchThreshold(matchThreshold?: number): void;
        /**
         * @return The maximum percentage(!) of different pixels (after intensity, width and height filtering) which is still considered as a match.
         */
        getMatchThreshold(): number;
    }

    /**
     * Encapsulates the match settings for a session.
     */
    export class ImageMatchSettings {
        /**
         * @param matchLevel The "strictness" level to use.
         * @param [exact] Additional threshold parameters when the {@code Exact} match level is used.
         * @param [ignoreCaret]
         */
        constructor(matchLevel: MatchLevel, exact?: ExactMatchSettings, ignoreCaret?: boolean);
        /**
         * @param matchLevel The match level to use.
         */
        setMatchLevel(matchLevel: MatchLevel): void;
        /**
         * @return The match level to use.
         */
        getMatchLevel(): MatchLevel;
        /**
         * @param exact The additional threshold parameters when the {@code Exact} match level is used.
         */
        setExact(exact: ImageMatchSettings): void;
        /**
         * @return The additional threshold parameters when the {@code Exact} match level is used, if any.
         */
        getExact(): ImageMatchSettings;
        setIgnoreCaret(ignoreCaret: boolean): void;
        isIgnoreCaret(): boolean;
        getIgnoreDisplacements(): boolean;
        setIgnoreDisplacements(value: boolean): void;
        getAccessibilitySettings(): AccessibilitySettings;
        setAccessibilitySettings(value: AccessibilitySettings): void;
    }
}


export declare class MutableImage {
    /**
     * @param image Encoded bytes of image
     * @param promiseFactory An object which will be used for creating deferreds/promises.
     **/
    constructor(image: Buffer, promiseFactory: PromiseFactory);
    /**
     * @param image64 base64 encoded bytes of image
     * @param promiseFactory An object which will be used for creating deferreds/promises.
     */
    static fromBase64(image64: string, promiseFactory: PromiseFactory): MutableImage;
    /**
     * Coordinates represent the image's position in a larger context (if any). E.g., A screenshot of the browser's viewport of a web page.
     * @return The coordinates of the image in the larger context (if any)
     */
    getCoordinates(): Promise<Location>;
    /**
     * Coordinates represent the image's position in a larger context (if any). E.g., A screenshot of the browser's viewport of a web page.
     */
    setCoordinates(coordinates: Location): Promise<void>;
    /**
     * Size of the image. Parses the image if necessary
     */
    getSize(): Promise<RectangleSize>;
    getWidth(): number;
    getHeight(): number;
    /**
     * Return the image as buffer and image width and height.
     */
    asObject(): Promise<{imageBuffer: Buffer, width: number, height: number}>;
    /**
     * Scales the image in place (used to downsize by 2 for retina display chrome bug - and tested accordingly).
     */
    scaleImage(scaleRatio: number): Promise<MutableImage>;
    /**
     * Crops the image according to the given region.
     */
    cropImage(region: Region): Promise<MutableImage>;
    /**
     * Rotates the image according to the given degrees.
     */
    rotateImage(degrees: number): Promise<MutableImage>;
    /**
     * Write image to local directory
     */
    saveImage(filename: string): Promise<void>;
    /**
     * Write image to local directory
     */
    getImageBuffer(): Promise<Buffer>;
    /**
     * Get an instance of png-async Image class
     */
    getImageData(): Promise<any>;
}


export declare class ServerConnector {
    /**
     * @param promiseFactory An object which will be used for creating deferreds/promises.
     * @param serverUrl
     * @param logger
     **/
    constructor(promiseFactory: PromiseFactory, serverUrl: string, logger: Logger);
    /**
     * Activate/Deactivate HTTP client debugging.
     * @param isDebug Whether or not to activate debugging.
     */
    setDebugMode(isDebug: boolean): void;
    /**
     * @return Whether or not debug mode is active.
     */
    getIsDebugMode(): boolean;
    /**
     * Sets the current server URL used by the rest client.
     * @param serverUrl The URI of the rest server.
     */
    setServerUrl(serverUrl: string): void;
    /**
     * @return The URI of the eyes server.
     */
    getServerUrl(): string;
    /**
     * Sets the API key of your applitools Eyes account.
     * @param runKey The run key to be used.
     * @param newAuthScheme Whether or not the server uses the new authentication scheme.
     */
    setApiKey(runKey: string, newAuthScheme?: boolean): void;
    /**
     * @return The current run key.
     */
    getApiKey(): string;
    /**
     * Sets the proxy settings to be used by the request module.
     * @param url The proxy url to be used. If {@code null} then no proxy is set.
     * @param [username]
     * @param [password]
     */
    setProxy(url: string, username?: string, password?: string): void;
    /**
      @return The current proxy settings used by the rest client, or {@code null} if no proxy is set.
     */
    getProxy(): string;
    /**
     * Whether sessions are removed immediately after they are finished.
     */
    setRemoveSession(shouldRemove: boolean): void;
    /**
     * @return Whether sessions are removed immediately after they are finished.
     */
    getRemoveSession(): boolean;
    /**
     * Starts a new running session in the server. Based on the given parameters, this running session will either be linked to an existing session, or to a completely new session.
     * @param sessionStartInfo The start parameters for the session.
     * @return Promise with a resolve result that represents the current running session.
     **/
    startSession(sessionStartInfo: SessionStartInfo): Promise<RunningSession>;
    /**
     * Ends a running session in the server. Session results are received from the server.
     * @param runningSession The session to end.
     * @param isAborted
     * @param save Save the session.
     * @return Promise with a resolve result that represents the test results.
     **/
    endSession(runningSession: RunningSession, isAborted: boolean, save: boolean): Promise<object>;
    /**
     * @return A promise which resolves when renderingInfo is ready, or rejects on error.
     */
    renderInfo(): Promise<object>;
    /**
     * Upload the screenshot.
     * @param id guid for url.
     * @param screenshot The PNG bytes of the updated image.
     * @return A promise which resolves when uploading is done, or rejects on error.
     */
    uploadScreenshot(id: string, screenshot: Buffer): Promise<string>;
    /**
     * Matches the current window to the expected window.
     * @param runningSession The current agent's running session.
     * @param matchWindowData The window data.
     * @return A promise which resolves when matching is done, or rejects on error.
     */
    matchWindow(runningSession: RunningSession, matchWindowData: object): Promise<object>;
    /**
     * Replaces an actual image in the current running session.
     * @param runningSession The currently running session.
     * @param stepIndex The zero based index of the step in which to replace the actual image.
     * @param replaceWindowData The updated window data (similar to matchWindowData only without ignoreMismatch).
     * @param screenshot The PNG bytes of the updated image.
     * @return A promise which resolves when replacing is done, or rejects on error.
     */
    replaceWindow(runningSession: RunningSession, stepIndex: number, replaceWindowData: object, screenshot: Buffer): Promise<object>;
}


export declare abstract class EyesBase {
    /**
     * @param promiseFactory An object which will be used for creating deferreds/promises.
     * @param serverUrl
     * @param isDisabled
     **/
    protected constructor(promiseFactory: PromiseFactory, serverUrl: string, isDisabled: boolean);
    /**
     * @return Whether eyes are open or not.
     */
    getIsOpen(): boolean;
    /**
     * @param eventHandler
     */
    addSessionEventHandler(eventHandler: any): void;
    /**
     * Set the log handler
     */
    setLogHandler(logHandler: LogHandler): void;
    /**
     * Sets the current server URL used by the rest client.
     * @param serverUrl The URI of the rest server.
     */
    setServerUrl(serverUrl: string): void;
    /**
     * @return The URI of the eyes server.
     */
    getServerUrl(): string;
    /**
     * Sets the API key of your applitools Eyes account.
     * @param apiKey The api key to be used.
     * @param newAuthScheme Whether or not the server uses the new authentication scheme.
     */
    setApiKey(apiKey: string, newAuthScheme?: boolean): void;
    /**
     * @return The currently set api key.
     */
    getApiKey(): string;
    /**
     * Whether sessions are removed immediately after they are finished.
     */
    setRemoveSession(shouldRemove: boolean): void;
    /**
     * @return Whether sessions are removed immediately after they are finished.
     */
    getRemoveSession(): boolean;
    /**
     * Sets the user given agent id of the SDK.
     * @param agentId The agent ID to set.
     */
    setAgentId(agentId: string): void;
    /**
     * @return The user given agent id of the SDK.
     */
    getAgentId(): string;
    /**
     * Sets the host OS name - overrides the one in the agent string.
     * @param os The host OS.
     */
    setHostOS(os: string): void;
    /**
     * @return The host OS as set by the user.
     */
    getHostOS(): string;
    /**
     * @deprecated
     * This function is deprecated, please use {@link setHostOS} instead. Sets the host OS name - overrides the one in the agent string.
     * @param os The host OS.
     */
    setOs(os: string): void;
    /**
     * @deprecated
     * This function is deprecated, please use {@link getHostOS} instead.
     * @return The host OS as set by the user.
     */
    getOs(): string;
    /**
     * Sets the hosting application - overrides the one in the agent string.
     * @param hostingApp The hosting application.
     */
    setHostingApp(hostingApp: string): void;
    /**
     * @return The hosting application as set by the user.
     */
    getHostingApp(): string;
    /**
     * If specified, determines the baseline to compare with and disables automatic baseline inference.
     * @deprecated Only available for backward compatibility. See {@link #setBaselineEnvName(string)}.
     * @param baselineName The hosting application.
     */
    setBaselineName(baselineName: string): void;
    /**
     * @deprecated Only available for backward compatibility. See {@link #getBaselineEnvName()}.
     * @return The baseline name, if it was specified.
     */
    getBaselineName(): string;
    /**
     * If not {@code null}, determines the name of the environment of the baseline.
     * @param baselineEnvName The name of the baseline's environment.
     */
    setBaselineEnvName(baselineEnvName: string): void;
    /**
     * If not {@code null}, determines the name of the environment of the baseline.
     * @return The name of the baseline's environment, or {@code null} if no such name was set.
     */
    getBaselineEnvName(): string;
    /**
     * If not {@code null} specifies a name for the environment in which the application under test is running.
     * @param envName The name of the environment of the baseline.
     */
    setEnvName(envName: string): void;
    /**
     * If not {@code null} specifies a name for the environment in which the application under test is running.
     * @return The name of the environment of the baseline, or {@code null} if no such name was set.
     */
    getEnvName(): string;
    /**
     * Sets the test batch
     */
    setBatch(name: string, batchId?: string, startedAt?: string): void;
    /**
     * Sets the test batch
     */
    setBatch(batch: BatchInfo): void;
    /**
     * @return gets the test batch.
     */
    getBatch(): BatchInfo;
    /**
     * Set whether or not new tests are saved by default.
     * @param shouldSave True if new tests should be saved by default. False otherwise.
     */
    setSaveNewTests(shouldSave: boolean): void;
    /**
     * @return True if new tests are saved by default.
     */
    getSaveNewTests(): boolean;
    /**
     * Set whether or not failed tests are saved by default.
     * @param shouldSave True if failed tests should be saved by default, false otherwise.
     */
    setSaveFailedTests(shouldSave: boolean): void;
    /**
     * @return True if failed tests are saved by default.
     */
    getSaveFailedTests(): boolean;
    /**
     * Sets the maximal time a match operation tries to perform a match.
     * @param timeout Timeout in milliseconds.
     */
    setDefaultMatchTimeout(timeout: number): void;
    /**
     * @return The maximal time in milliseconds a match operation tries to perform a match.
     */
    getDefaultMatchTimeout(): number;
    /**
     * Activate/Deactivate HTTP client debugging.
     * @param isDebug Whether or not debug mode is active.
     */
    setDebugMode(isDebug: boolean): void;
    /**
     * @return Whether or not HTTP client debugging mode is active.
     */
    getIsDebugMode(): boolean;
    /**
     * @param mode Use one of the values in EyesBase.FailureReport.
     */
    setFailureReport(mode: EyesBase.FailureReport): void;
    /**
     * @return The currently set FailureReport.
     */
    getFailureReport(): EyesBase.FailureReport;
    /**
     * @deprecated
     * This function is superseded by {@link setDefaultMatchSettings}.
     * @param level The test-wide match level to use when checking application screenshot with the expected output.
     */
    setMatchLevel(level: MatchSettings.MatchLevel): void;
    /**
     * @deprecated
     * This function is superseded by {@link getDefaultMatchSettings}
     * @return The test-wide match level.
     */
    getMatchLevel(): MatchSettings.MatchLevel;
    /**
     * @param defaultMatchSettings The match settings for the session.
     */
    setDefaultMatchSettings(defaultMatchSettings: MatchSettings.ImageMatchSettings): void;
    /**
     * @return The match settings for the session.
     */
    getDefaultMatchSettings(): MatchSettings.ImageMatchSettings;
    /**
     * Sets the ignore blinking caret value.
     * @param ignoreCaret The ignore value.
     */
    setIgnoreCaret(ignoreCaret: boolean): void;
    /**
     * @return Whether to ignore or the blinking caret or not when comparing images.
     */
    getIgnoreCaret(): boolean;
    /**
     * The test-wide ignoreDisplacements to use.
     * @param value The test-wide ignoreDisplacements to use in match requests.
     */
    setIgnoreDisplacements(value: boolean): void;
    /**
     * @return The test-wide ignoreDisplacements to use in match requests.
     */
    getIgnoreDisplacements(): boolean;
    /**
     * The test-wide accesibilityValidation to use.
     * @param value The test-wide accesibilityValidation to use in open requests.
     */
    setAccessibilityValidation(value: AccessibilitySettings): void;
    /**
     * @return The test-wide accesibilityValidation to use in open requests.
     */
    getAccessibilityValidation(): AccessibilitySettings;
    /**
     * @return The currently compareWithParentBranch value
     */
    isCompareWithParentBranch(): boolean;
    /**
     * @param compareWithParentBranch New compareWithParentBranch value, default is false
     */
    setCompareWithParentBranch(compareWithParentBranch: boolean): void;
    /**
     * @return The currently ignoreBaseline value
     */
    isIgnoreBaseline(): boolean;
    /**
     * @param ignoreBaseline New ignoreBaseline value, default is false
     */
    setIgnoreBaseline(ignoreBaseline: boolean): void;
    /**
     * @return The currently set position provider.
     */
    getPositionProvider(): PositionProvider;
    /**
     * @param positionProvider The position provider to be used.
     */
    setPositionProvider(positionProvider: PositionProvider): void;
    /**
     * Manually set the the sizes to cut from an image before it's validated.
     * @param cutProvider the provider doing the cut.
     */
    setImageCut(cutProvider?: CutProvider): void;
    getIsCutProviderExplicitlySet(): boolean;
    /**
     * @return The ratio used to scale the images being validated.
     */
    getScaleRatio(): number;
    /**
     * Manually set the scale ratio for the images being validated.
     * @param [scaleRatio=1] The scale ratio to use, or {@code null} to reset back to automatic scaling.
     */
    setScaleRatio(scaleRatio?: number): void;
    /**
     * @param saveDebugScreenshots If true, will save all screenshots to local directory
     * @param pathToSave Path where you want to save debug screenshots
     */
    setSaveDebugScreenshots(saveDebugScreenshots: boolean, pathToSave: string): void;
    getSaveDebugScreenshots(): boolean;
    /**
     * Sets the branch name.
     * @param branchName The branch name.
     */
    setBranchName(branchName: string): void;
    /**
     * @return The branch name.
     */
    getBranchName(): string;
    /**
     * Sets the parent branch name.
     * @param parentBranchName The parent branch name.
     */
    setParentBranchName(parentBranchName: string): void;
    /**
     * @return The parent branch name.
     */
    getParentBranchName(): string;
    /**
     * Sets the baseline branch under which new branches are created.
     * @param baselineBranchName Branch name or {@code null} to specify the default branch.
     */
    setBaselineBranchName(baselineBranchName: string): void;
    /**
     * @return The name of the baseline branch.
     */
    getBaselineBranchName(): string;
    /**
     * Sets the proxy settings to be used by the request module.
     * @return proxySettings The proxy url to be used by the serverConnector. If {@code null} then no proxy is set.
     */
    setProxy(url: string, username?: string, password?: string): void;
    /**
     * @return current proxy settings used by the server connector, or {@code null} if no proxy is set.
     */
    getProxy(): string;
    /**
     * Used for grouping test results by custom test properties
     * @param name The name of property
     * @param value The value of property
     */
    addProperty(name: string, value: string): void;
    /**
     * @return The name of the currently running test.
     */
    getTestName(): string|null;
    /**
     * @return The name of the currently tested application.
     */
    getAppName(): string|null;
    /**
     * @return Whether eyes is disabled.
     */
    getIsDisabled(): boolean;
    /**
     * @param isDisabled If true, all interactions with this API will be silently ignored.
     */
    setIsDisabled(isDisabled: boolean): void;
    /**
     * @return An object containing data about the currently running session.
     */
    getRunningSession(): object;
    openBase(appName: string, testName: string, viewportSize?: RectangleSize): Promise<void>;
    /**
     * Creates an error object based on the test results. This method is also used by wrapper SDKs (which is why it is defined as a method) for creating an error for immediate failure reports (i.e., when the user wants to know immediately when a checkWindow returns false).
     * @param results The TestResults object.
     * @param testName The test name.
     * @param appName The application name
     * @return An error object representing the tets.
     */
    static buildTestError(results: TestResults, testName: string, appName: string): Error|null;
    /**
     * Ends the currently running test.
     * @param [throwEx=true] If true, then the returned promise will 'reject' for failed/aborted tests.
     * @return A promise which resolves/rejects (depending on the value of 'throwEx') to the test results.
     */
    close(throwEx?: boolean): Promise<TestResults>;
    /**
     * Aborts the currently running test.
     * @alias abort
     * @return A promise which resolves to the test results.
     */
    abortIfNotClosed(): Promise<TestResults>;
    /**
     * Aborts the currently running test.
     * @return A promise which resolves to the test results.
     */
    abort(): Promise<TestResults>;
    /**
     * The viewport size of the AUT.
     */
    abstract getViewportSize(): Promise<RectangleSize>;
    /**
     * @param size The required viewport size.
     */
    abstract setViewportSize(size: RectangleSize): Promise<void>;
    /**
     * An updated screenshot.
     */
    abstract getScreenShot(): Promise<EyesScreenshot>;
    /**
     * The current title of of the AUT.
     */
    abstract getTitle(): Promise<string>;
    checkWindowBase(tag: string|undefined, ignoreMismatch: boolean|undefined, retryTimeout: number|undefined, regionProvider: RegionProvider, imageMatchSettings: MatchSettings.ImageMatchSettings|undefined, source: string|undefined): Promise<{asExpected: boolean}>;
    /**
     * Replaces an actual image in the current running session.
     * @param stepIndex The zero based index of the step in which to replace the actual image.
     * @param screenshot The PNG bytes of the updated screenshot.
     * @param tag The updated tag for the step.
     * @param title The updated title for the step.
     * @param userInputs The updated userInputs for the step.
     * @return A promise which resolves when replacing is done, or rejects on error.
     */
    replaceWindow(stepIndex: number, screenshot: Buffer, tag?: string, title?: string, userInputs?: Trigger[]): Promise<void>;
    startSession(): Promise<void>;
    addKeyboardTrigger(control: Region, text: string): void;
    addMouseTrigger(mouseAction: Triggers.MouseAction, control: Region, cursor: Location): void;
    getPromiseFactory(): PromiseFactory;
    log(...args: any[]): void;
}


export declare namespace EyesBase {
    export enum TestResultsStatus {
        Passed = 'Passed',
        Unresolved = 'Unresolved',
        Failed = 'Failed'
    }

    export enum FailureReport {
        /** Failures are reported immediately when they are detected. */
        Immediate = 'Immediate',
        /** Failures are reported when tests are completed (i.e., when Eyes.close() is called). */
        OnClose = 'OnClose'
    }
}
