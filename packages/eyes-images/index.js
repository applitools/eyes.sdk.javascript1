'use strict'

const core = require('@applitools/eyes-sdk-core')

exports.ImagesCheckSettings = require('./lib/fluent/ImagesCheckSettings').ImagesCheckSettings
exports.Target = require('./lib/fluent/Target').Target

exports.Eyes = require('./lib/Eyes').Eyes

// eyes-common
exports.AccessibilityLevel = core.AccessibilityLevel
exports.AccessibilityMatchSettings = core.AccessibilityMatchSettings
exports.AccessibilityRegionType = core.AccessibilityRegionType
exports.AccessibilityGuidelinesVersion = core.AccessibilityGuidelinesVersion
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
exports.GeneralUtils = core.GeneralUtils

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
exports.BatchClose = core.BatchClose
