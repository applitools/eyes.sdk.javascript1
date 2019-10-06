'use strict';

const common = require('@applitools/eyes-common');
const core = require('@applitools/eyes-sdk-core');

exports.EyesWebDriverScreenshot = require('./lib/capture/EyesWebDriverScreenshot').EyesWebDriverScreenshot;
exports.EyesWebDriverScreenshotFactory = require('./lib/capture/EyesWebDriverScreenshotFactory').EyesWebDriverScreenshotFactory;
exports.FirefoxScreenshotImageProvider = require('./lib/capture/FirefoxScreenshotImageProvider').FirefoxScreenshotImageProvider;
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory').ImageProviderFactory;
exports.SafariScreenshotImageProvider = require('./lib/capture/SafariScreenshotImageProvider').SafariScreenshotImageProvider;
exports.TakesScreenshotImageProvider = require('./lib/capture/TakesScreenshotImageProvider').TakesScreenshotImageProvider;

exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError').EyesDriverOperationError;
exports.NoFramesError = require('./lib/errors/NoFramesError').NoFramesError;

exports.AccessibilityRegionByElement = require('./lib/fluent/AccessibilityRegionByElement').AccessibilityRegionByElement;
exports.AccessibilityRegionBySelector = require('./lib/fluent/AccessibilityRegionBySelector').AccessibilityRegionBySelector;
exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement').FloatingRegionByElement;
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector').FloatingRegionBySelector;
exports.FrameLocator = require('./lib/fluent/FrameLocator').FrameLocator;
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement').IgnoreRegionByElement;
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector').IgnoreRegionBySelector;
exports.SelectorByElement = require('./lib/fluent/SelectorByElement').SelectorByElement;
exports.SelectorByLocator = require('./lib/fluent/SelectorByLocator').SelectorByLocator;
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
exports.TestResultsSummary = require('./lib/runner/TestResultsSummary').TestResultsSummary;

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
exports.AccessibilityLevel = common.AccessibilityLevel;
exports.AccessibilityMatchSettings = common.AccessibilityMatchSettings;
exports.AccessibilityRegionType = common.AccessibilityRegionType;
exports.BatchInfo = common.BatchInfo;
exports.BrowserType = common.BrowserType;
exports.Configuration = common.Configuration;
exports.DeviceName = common.DeviceName;
exports.ExactMatchSettings = common.ExactMatchSettings;
exports.FloatingMatchSettings = common.FloatingMatchSettings;
exports.ImageMatchSettings = common.ImageMatchSettings;
exports.MatchLevel = common.MatchLevel;
exports.PropertyData = common.PropertyData;
exports.ProxySettings = common.ProxySettings;
exports.ScreenOrientation = common.ScreenOrientation;
exports.StitchMode = common.StitchMode;
exports.DebugScreenshotsProvider = common.DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = common.NullDebugScreenshotProvider;
exports.EyesError = common.EyesError;
exports.CoordinatesType = common.CoordinatesType;
exports.Location = common.Location;
exports.RectangleSize = common.RectangleSize;
exports.Region = common.Region;
exports.PropertyHandler = common.PropertyHandler;
exports.ReadOnlyPropertyHandler = common.ReadOnlyPropertyHandler;
exports.SimplePropertyHandler = common.SimplePropertyHandler;
exports.ImageDeltaCompressor = common.ImageDeltaCompressor;
exports.MutableImage = common.MutableImage;
exports.ConsoleLogHandler = common.ConsoleLogHandler;
exports.DebugLogHandler = common.DebugLogHandler;
exports.FileLogHandler = common.FileLogHandler;
exports.Logger = common.Logger;
exports.LogHandler = common.LogHandler;
exports.NullLogHandler = common.NullLogHandler;


// eyes-sdk-core
exports.ImageProvider = core.ImageProvider;
exports.FullPageCaptureAlgorithm = core.FullPageCaptureAlgorithm;
exports.EyesSimpleScreenshotFactory = core.EyesSimpleScreenshotFactory;
exports.CorsIframeHandle = core.CorsIframeHandle;
exports.CutProvider = core.CutProvider;
exports.FixedCutProvider = core.FixedCutProvider;
exports.NullCutProvider = core.NullCutProvider;
exports.UnscaledFixedCutProvider = core.UnscaledFixedCutProvider;
exports.ScaleProvider = core.ScaleProvider;
exports.FixedScaleProvider = core.FixedScaleProvider;
exports.FixedScaleProviderFactory = core.FixedScaleProviderFactory;
exports.PositionMemento = core.PositionMemento;
exports.PositionProvider = core.PositionProvider;
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
