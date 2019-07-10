'use strict';

const common = require('@applitools/eyes-common');
const core = require('@applitools/eyes-sdk-core');

exports.Configuration = require('./lib/config/Configuration').Configuration;
exports.BrowserType = require('./lib/config/BrowserType').BrowserType;
exports.DeviceName = require('./lib/config/DeviceName').DeviceName;
exports.ScreenOrientation = require('./lib/config/ScreenOrientation').ScreenOrientation;
exports.StitchMode = require('./lib/config/StitchMode').StitchMode;

exports.EyesWebDriverScreenshot = require('./lib/capture/EyesWebDriverScreenshot').EyesWebDriverScreenshot;
exports.EyesWebDriverScreenshotFactory = require('./lib/capture/EyesWebDriverScreenshotFactory').EyesWebDriverScreenshotFactory;
exports.FirefoxScreenshotImageProvider = require('./lib/capture/FirefoxScreenshotImageProvider').FirefoxScreenshotImageProvider;
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory').ImageProviderFactory;
exports.SafariScreenshotImageProvider = require('./lib/capture/SafariScreenshotImageProvider').SafariScreenshotImageProvider;
exports.TakesScreenshotImageProvider = require('./lib/capture/TakesScreenshotImageProvider').TakesScreenshotImageProvider;

exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError').EyesDriverOperationError;
exports.NoFramesError = require('./lib/errors/NoFramesError').NoFramesError;

exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement').FloatingRegionByElement;
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector').FloatingRegionBySelector;
exports.SelectorByElement = require('./lib/fluent/SelectorByElement').SelectorByElement;
exports.SelectorByLocator = require('./lib/fluent/SelectorByLocator').SelectorByLocator;
exports.FrameLocator = require('./lib/fluent/FrameLocator').FrameLocator;
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement').IgnoreRegionByElement;
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector').IgnoreRegionBySelector;
exports.SeleniumCheckSettings = require('./lib/fluent/SeleniumCheckSettings').SeleniumCheckSettings;
exports.Target = require('./lib/fluent/Target').Target;

exports.Frame = require('./lib/frames/Frame').Frame;
exports.FrameChain = require('./lib/frames/FrameChain').FrameChain;

exports.CssTranslatePositionMemento = require('./lib/positioning/CssTranslatePositionMemento').CssTranslatePositionMemento;
exports.CssTranslatePositionProvider = require('./lib/positioning/CssTranslatePositionProvider').CssTranslatePositionProvider;
exports.ElementPositionMemento = require('./lib/positioning/ElementPositionMemento').ElementPositionMemento;
exports.ElementPositionProvider = require('./lib/positioning/ElementPositionProvider').ElementPositionProvider;
exports.FirefoxRegionPositionCompensation = require('./lib/positioning/FirefoxRegionPositionCompensation').FirefoxRegionPositionCompensation;
exports.ImageRotation = require('./lib/positioning/ImageRotation').ImageRotation;
exports.OverflowAwareCssTranslatePositionProvider = require('./lib/positioning/OverflowAwareCssTranslatePositionProvider').OverflowAwareCssTranslatePositionProvider;
exports.OverflowAwareScrollPositionProvider = require('./lib/positioning/OverflowAwareScrollPositionProvider').OverflowAwareScrollPositionProvider;
exports.RegionPositionCompensationFactory = require('./lib/positioning/RegionPositionCompensationFactory').RegionPositionCompensationFactory;
exports.SafariRegionPositionCompensation = require('./lib/positioning/SafariRegionPositionCompensation').SafariRegionPositionCompensation;
exports.ScrollPositionMemento = require('./lib/positioning/ScrollPositionMemento').ScrollPositionMemento;
exports.ScrollPositionProvider = require('./lib/positioning/ScrollPositionProvider').ScrollPositionProvider;

exports.MoveToRegionVisibilityStrategy = require('./lib/regionVisibility/MoveToRegionVisibilityStrategy').MoveToRegionVisibilityStrategy;
exports.NopRegionVisibilityStrategy = require('./lib/regionVisibility/NopRegionVisibilityStrategy').NopRegionVisibilityStrategy;
exports.RegionVisibilityStrategy = require('./lib/regionVisibility/RegionVisibilityStrategy').RegionVisibilityStrategy;

exports.ClassicRunner = require('./lib/runner/ClassicRunner').ClassicRunner;
exports.VisualGridRunner = require('./lib/runner/VisualGridRunner').VisualGridRunner;
exports.TestResultContainer = require('./lib/runner/TestResultContainer').TestResultContainer;
exports.TestResultSummary = require('./lib/runner/TestResultSummary').TestResultSummary;

exports.EyesTargetLocator = require('./lib/wrappers/EyesTargetLocator').EyesTargetLocator;
exports.EyesWebDriver = require('./lib/wrappers/EyesWebDriver').EyesWebDriver;
exports.EyesWebElement = require('./lib/wrappers/EyesWebElement').EyesWebElement;
exports.EyesWebElementPromise = require('./lib/wrappers/EyesWebElementPromise').EyesWebElementPromise;

exports.BordersAwareElementContentLocationProvider = require('./lib/BordersAwareElementContentLocationProvider').BordersAwareElementContentLocationProvider;
exports.EyesSeleniumUtils = require('./lib/EyesSeleniumUtils').EyesSeleniumUtils;
exports.ImageOrientationHandler = require('./lib/ImageOrientationHandler').ImageOrientationHandler;
exports.JavascriptHandler = require('./lib/JavascriptHandler').JavascriptHandler;
exports.SeleniumJavaScriptExecutor = require('./lib/SeleniumJavaScriptExecutor').SeleniumJavaScriptExecutor;

exports.Eyes = require('./lib/EyesFactory').EyesFactory;
exports.EyesSelenium = require('./lib/EyesSelenium').EyesSelenium;
exports.EyesVisualGrid = require('./lib/EyesVisualGrid').EyesVisualGrid;


// eyes-common
exports.MatchLevel = common.MatchLevel;
exports.ImageMatchSettings = common.ImageMatchSettings;
exports.ExactMatchSettings = common.ExactMatchSettings;
exports.FloatingMatchSettings = common.FloatingMatchSettings;
exports.BatchInfo = common.BatchInfo;
exports.PropertyData = common.PropertyData;
exports.ProxySettings = common.ProxySettings;
exports.EyesError = common.EyesError;
exports.DebugScreenshotsProvider = common.DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = common.NullDebugScreenshotProvider;
exports.Location = common.Location;
exports.RectangleSize = common.RectangleSize;
exports.Region = common.Region;
exports.MutableImage = common.MutableImage;
exports.Logger = common.Logger;
exports.ConsoleLogHandler = common.ConsoleLogHandler;
exports.FileLogHandler = common.FileLogHandler;
exports.LogHandler = common.LogHandler;
exports.NullLogHandler = common.NullLogHandler;


// eyes-sdk-core
exports.ImageProvider = core.ImageProvider;
exports.CorsIframeHandle = core.CorsIframeHandle;
exports.CutProvider = core.CutProvider;
exports.FixedCutProvider = core.FixedCutProvider;
exports.NullCutProvider = core.NullCutProvider;
exports.UnscaledFixedCutProvider = core.UnscaledFixedCutProvider;
exports.RemoteSessionEventHandler = core.RemoteSessionEventHandler;
exports.SessionEventHandler = core.SessionEventHandler;
exports.ValidationInfo = core.ValidationInfo;
exports.ValidationResult = core.ValidationResult;
exports.CoordinatesTypeConversionError = core.CoordinatesTypeConversionError;
exports.DiffsFoundError = core.DiffsFoundError;
exports.NewTestError = core.NewTestError;
exports.OutOfBoundsError = core.OutOfBoundsError;
exports.TestFailedError = core.TestFailedError;
exports.MatchResult = core.MatchResult;
exports.NullRegionProvider = core.NullRegionProvider;
exports.RegionProvider = core.RegionProvider;
exports.RunningSession = core.RunningSession;
exports.SessionType = core.SessionType;
exports.FailureReports = core.FailureReports;
exports.TestResults = core.TestResults;
exports.TestResultsFormatter = core.TestResultsFormatter;
exports.TestResultsStatus = core.TestResultsStatus;
