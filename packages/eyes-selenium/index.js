'use strict'

const core = require('@applitools/eyes-sdk-core')

exports.EyesWebDriverScreenshot = require('./lib/capture/EyesWebDriverScreenshot').EyesWebDriverScreenshot
exports.EyesWebDriverScreenshotFactory = require('./lib/capture/EyesWebDriverScreenshotFactory').EyesWebDriverScreenshotFactory
exports.FirefoxScreenshotImageProvider = require('./lib/capture/FirefoxScreenshotImageProvider').FirefoxScreenshotImageProvider
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory').ImageProviderFactory
exports.SafariScreenshotImageProvider = require('./lib/capture/SafariScreenshotImageProvider').SafariScreenshotImageProvider
exports.TakesScreenshotImageProvider = require('./lib/capture/TakesScreenshotImageProvider').TakesScreenshotImageProvider

exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError').EyesDriverOperationError
exports.NoFramesError = require('./lib/errors/NoFramesError').NoFramesError

exports.AccessibilityRegionByElement = require('./lib/fluent/AccessibilityRegionByElement').AccessibilityRegionByElement
exports.AccessibilityRegionBySelector = require('./lib/fluent/AccessibilityRegionBySelector').AccessibilityRegionBySelector
exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement').FloatingRegionByElement
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector').FloatingRegionBySelector
exports.FrameLocator = require('./lib/fluent/FrameLocator').FrameLocator
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement').IgnoreRegionByElement
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector').IgnoreRegionBySelector
exports.SelectorByElement = require('./lib/fluent/SelectorByElement').SelectorByElement
exports.SelectorByLocator = require('./lib/fluent/SelectorByLocator').SelectorByLocator
exports.SeleniumCheckSettings = require('./lib/fluent/SeleniumCheckSettings').SeleniumCheckSettings
exports.Target = require('./lib/fluent/Target').Target

exports.Frame = require('./lib/frames/Frame').Frame
exports.FrameChain = require('./lib/frames/FrameChain').FrameChain

exports.CssTranslatePositionMemento = require('./lib/positioning/CssTranslatePositionMemento').CssTranslatePositionMemento
exports.CssTranslatePositionProvider = require('./lib/positioning/CssTranslatePositionProvider').CssTranslatePositionProvider
exports.ElementPositionMemento = require('./lib/positioning/ElementPositionMemento').ElementPositionMemento
exports.ElementPositionProvider = require('./lib/positioning/ElementPositionProvider').ElementPositionProvider
exports.FirefoxRegionPositionCompensation = require('./lib/positioning/FirefoxRegionPositionCompensation').FirefoxRegionPositionCompensation
exports.ImageRotation = require('./lib/positioning/ImageRotation').ImageRotation
exports.OverflowAwareCssTranslatePositionProvider = require('./lib/positioning/OverflowAwareCssTranslatePositionProvider').OverflowAwareCssTranslatePositionProvider
exports.OverflowAwareScrollPositionProvider = require('./lib/positioning/OverflowAwareScrollPositionProvider').OverflowAwareScrollPositionProvider
exports.RegionPositionCompensationFactory = require('./lib/positioning/RegionPositionCompensationFactory').RegionPositionCompensationFactory
exports.SafariRegionPositionCompensation = require('./lib/positioning/SafariRegionPositionCompensation').SafariRegionPositionCompensation
exports.ScrollPositionMemento = require('./lib/positioning/ScrollPositionMemento').ScrollPositionMemento
exports.ScrollPositionProvider = require('./lib/positioning/ScrollPositionProvider').ScrollPositionProvider

exports.MoveToRegionVisibilityStrategy = require('./lib/regionVisibility/MoveToRegionVisibilityStrategy').MoveToRegionVisibilityStrategy
exports.NopRegionVisibilityStrategy = require('./lib/regionVisibility/NopRegionVisibilityStrategy').NopRegionVisibilityStrategy
exports.RegionVisibilityStrategy = require('./lib/regionVisibility/RegionVisibilityStrategy').RegionVisibilityStrategy

exports.EyesTargetLocator = require('./lib/wrappers/EyesTargetLocator').EyesTargetLocator
exports.EyesWebDriver = require('./lib/wrappers/EyesWebDriver').EyesWebDriver
exports.EyesWebElement = require('./lib/wrappers/EyesWebElement').EyesWebElement
exports.EyesWebElementPromise = require('./lib/wrappers/EyesWebElementPromise').EyesWebElementPromise

exports.BordersAwareElementContentLocationProvider = require('./lib/BordersAwareElementContentLocationProvider').BordersAwareElementContentLocationProvider
exports.EyesSeleniumUtils = require('./lib/EyesSeleniumUtils').EyesSeleniumUtils
exports.ImageOrientationHandler = require('./lib/ImageOrientationHandler').ImageOrientationHandler
exports.JavascriptHandler = require('./lib/JavascriptHandler').JavascriptHandler
exports.SeleniumJavaScriptExecutor = require('./lib/SeleniumJavaScriptExecutor').SeleniumJavaScriptExecutor

exports.Eyes = require('./lib/EyesFactory').EyesFactory
exports.EyesSelenium = require('./lib/EyesSelenium').EyesSelenium
exports.EyesVisualGrid = require('./lib/EyesVisualGrid').EyesVisualGrid

// eyes-common
exports.AccessibilityLevel = core.AccessibilityLevel
exports.AccessibilityGuidelinesVersion = core.AccessibilityGuidelinesVersion
exports.AccessibilityMatchSettings = core.AccessibilityMatchSettings
exports.AccessibilityRegionType = core.AccessibilityRegionType
exports.BatchInfo = core.BatchInfo
exports.BrowserType = core.BrowserType
exports.Configuration = core.Configuration
exports.DeviceName = core.DeviceName
exports.ExactMatchSettings = core.ExactMatchSettings
exports.FloatingMatchSettings = core.FloatingMatchSettings
exports.ImageMatchSettings = core.ImageMatchSettings
exports.MatchLevel = core.MatchLevel
exports.PropertyData = core.PropertyData
exports.ProxySettings = core.ProxySettings
exports.ScreenOrientation = core.ScreenOrientation
exports.StitchMode = core.StitchMode
exports.DebugScreenshotsProvider = core.DebugScreenshotsProvider
exports.FileDebugScreenshotsProvider = core.FileDebugScreenshotsProvider
exports.NullDebugScreenshotProvider = core.NullDebugScreenshotProvider
exports.EyesError = core.EyesError
exports.CoordinatesType = core.CoordinatesType
exports.Location = core.Location
exports.RectangleSize = core.RectangleSize
exports.Region = core.Region
exports.PropertyHandler = core.PropertyHandler
exports.ReadOnlyPropertyHandler = core.ReadOnlyPropertyHandler
exports.SimplePropertyHandler = core.SimplePropertyHandler
exports.ImageDeltaCompressor = core.ImageDeltaCompressor
exports.MutableImage = core.MutableImage
exports.ConsoleLogHandler = core.ConsoleLogHandler
exports.DebugLogHandler = core.DebugLogHandler
exports.FileLogHandler = core.FileLogHandler
exports.Logger = core.Logger
exports.LogHandler = core.LogHandler
exports.NullLogHandler = core.NullLogHandler

// eyes-sdk-core
exports.ImageProvider = core.ImageProvider
exports.FullPageCaptureAlgorithm = core.FullPageCaptureAlgorithm
exports.EyesSimpleScreenshotFactory = core.EyesSimpleScreenshotFactory
exports.CorsIframeHandle = core.CorsIframeHandle
exports.CutProvider = core.CutProvider
exports.FixedCutProvider = core.FixedCutProvider
exports.NullCutProvider = core.NullCutProvider
exports.UnscaledFixedCutProvider = core.UnscaledFixedCutProvider
exports.ScaleProvider = core.ScaleProvider
exports.FixedScaleProvider = core.FixedScaleProvider
exports.FixedScaleProviderFactory = core.FixedScaleProviderFactory
exports.PositionMemento = core.PositionMemento
exports.PositionProvider = core.PositionProvider
exports.RemoteSessionEventHandler = core.RemoteSessionEventHandler
exports.SessionEventHandler = core.SessionEventHandler
exports.ValidationInfo = core.ValidationInfo
exports.ValidationResult = core.ValidationResult
exports.CoordinatesTypeConversionError = core.CoordinatesTypeConversionError
exports.DiffsFoundError = core.DiffsFoundError
exports.NewTestError = core.NewTestError
exports.OutOfBoundsError = core.OutOfBoundsError
exports.TestFailedError = core.TestFailedError
exports.MatchResult = core.MatchResult
exports.NullRegionProvider = core.NullRegionProvider
exports.RegionProvider = core.RegionProvider
exports.RunningSession = core.RunningSession
exports.SessionType = core.SessionType
exports.FailureReports = core.FailureReports
exports.TestResults = core.TestResults
exports.TestResultsFormatter = core.TestResultsFormatter
exports.TestResultsStatus = core.TestResultsStatus
exports.ClassicRunner = core.ClassicRunner
exports.VisualGridRunner = core.VisualGridRunner
exports.TestResultContainer = core.TestResultContainer
exports.TestResultsSummary = core.TestResultsSummary
