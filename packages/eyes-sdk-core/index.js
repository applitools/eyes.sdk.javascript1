'use strict'
/* eslint-disable max-len */

/**
 * @typedef {import('./lib/config/Configuration').PlainConfiguration} PlainConfiguration
 * @typedef {import('./lib/config/Configuration').PlainConfigurationClassic} PlainConfigurationClassic
 * @typedef {import('./lib/config/Configuration').PlainConfigurationVisualGrid} PlainConfigurationVisualGrid
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./lib/wrappers/EyesDriver').SpecDriver<TDriver, TElement, TSelector>} SpecDriver
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./lib/wrappers/EyesWrappedElement').SpecElement<TDriver, TElement, TSelector>} SpecElement
 */

/**
 * @template TDriver, TElement, TSelector
 * @typedef {import('./lib/frames/Frame').SpecFrame<TDriver, TElement, TSelector>} SpecFrame
 */

/**
 * @template TElement, TSelector
 * @typedef {import('./lib/fluent/DriverCheckSettings').SpecCheckSettings<TElement, TSelector>} SpecCheckSettings
 */

// config
exports.AccessibilityLevel = require('./lib/config/AccessibilityLevel')
exports.AccessibilityGuidelinesVersion = require('./lib/config/AccessibilityGuidelinesVersion')
exports.AccessibilityMatchSettings = require('./lib/config/AccessibilityMatchSettings')
exports.AccessibilityRegionType = require('./lib/config/AccessibilityRegionType')
exports.BatchInfo = require('./lib/config/BatchInfo')
exports.BrowserType = require('./lib/config/BrowserType')
exports.Configuration = require('./lib/config/Configuration')
exports.DeviceName = require('./lib/config/DeviceName')
exports.ExactMatchSettings = require('./lib/config/ExactMatchSettings')
exports.FloatingMatchSettings = require('./lib/config/FloatingMatchSettings')
exports.ImageMatchSettings = require('./lib/config/ImageMatchSettings')
exports.MatchLevel = require('./lib/config/MatchLevel')
exports.PropertyData = require('./lib/config/PropertyData')
exports.ProxySettings = require('./lib/config/ProxySettings')
exports.ScreenOrientation = require('./lib/config/ScreenOrientation')
exports.SessionType = require('./lib/config/SessionType')
exports.StitchMode = require('./lib/config/StitchMode')
exports.IosDeviceName = require('./lib/config/IosDeviceName')
exports.IosVersion = require('./lib/config/IosVersion')

// debug
exports.DebugScreenshotsProvider = require('./lib/debug/DebugScreenshotsProvider')
exports.FileDebugScreenshotsProvider = require('./lib/debug/FileDebugScreenshotsProvider')
exports.NullDebugScreenshotProvider = require('./lib/debug/NullDebugScreenshotProvider')

// errors
exports.EyesError = require('./lib/errors/EyesError')
exports.CoordinatesTypeConversionError = require('./lib/errors/CoordinatesTypeConversionError')
exports.DiffsFoundError = require('./lib/errors/DiffsFoundError')
exports.NewTestError = require('./lib/errors/NewTestError')
exports.OutOfBoundsError = require('./lib/errors/OutOfBoundsError')
exports.TestFailedError = require('./lib/errors/TestFailedError')
exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError')
exports.ElementNotFoundError = require('./lib/errors/ElementNotFoundError')

// geometry
exports.CoordinatesType = require('./lib/geometry/CoordinatesType')
exports.Location = require('./lib/geometry/Location')
exports.RectangleSize = require('./lib/geometry/RectangleSize')
exports.Region = require('./lib/geometry/Region')

// handler
exports.PropertyHandler = require('./lib/handler/PropertyHandler')
exports.ReadOnlyPropertyHandler = require('./lib/handler/ReadOnlyPropertyHandler')
exports.SimplePropertyHandler = require('./lib/handler/SimplePropertyHandler')

// images
exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor')
exports.MutableImage = require('./lib/images/MutableImage')

// logging
exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler')
exports.DebugLogHandler = require('./lib/logging/DebugLogHandler')
exports.FileLogHandler = require('./lib/logging/FileLogHandler') // -browser
exports.Logger = require('./lib/logging/Logger')
exports.LogHandler = require('./lib/logging/LogHandler')
exports.NullLogHandler = require('./lib/logging/NullLogHandler')

// useragent
exports.BrowserNames = require('./lib/useragent/BrowserNames')
exports.OSNames = require('./lib/useragent/OSNames')
exports.UserAgent = require('./lib/useragent/UserAgent')

// utils
exports.ArgumentGuard = require('./lib/utils/ArgumentGuard')
exports.ConfigUtils = require('./lib/utils/ConfigUtils')
exports.DateTimeUtils = require('./lib/utils/DateTimeUtils')
exports.FileUtils = require('./lib/utils/FileUtils')
exports.GeneralUtils = require('./lib/utils/GeneralUtils')
exports.ImageUtils = require('./lib/utils/ImageUtils')
exports.PerformanceUtils = require('./lib/utils/PerformanceUtils')
exports.StreamUtils = require('./lib/utils/StreamUtils')
exports.TypeUtils = require('./lib/utils/TypeUtils')
exports.deserializeDomSnapshotResult = require('./lib/utils/deserializeDomSnapshotResult')
exports.AppOutputProvider = require('./lib/capture/AppOutputProvider')
exports.AppOutputWithScreenshot = require('./lib/capture/AppOutputWithScreenshot')
exports.EyesScreenshot = require('./lib/capture/EyesScreenshot')
exports.EyesScreenshotNew = require('./lib/capture/EyesScreenshotNew')
exports.EyesScreenshotFactory = require('./lib/capture/EyesScreenshotFactory')
exports.EyesSimpleScreenshot = require('./lib/capture/EyesSimpleScreenshot')
exports.EyesSimpleScreenshotFactory = require('./lib/capture/EyesSimpleScreenshotFactory')
exports.FullPageCaptureAlgorithm = require('./lib/capture/FullPageCaptureAlgorithm')
exports.ImageProvider = require('./lib/capture/ImageProvider')
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory')
exports.CorsIframeHandle = require('./lib/capture/CorsIframeHandles')
exports.CorsIframeHandler = require('./lib/capture/CorsIframeHandler')

const closeBatch = require('./lib/close/closeBatch')
const makeBatchClose = require('./lib/close/BatchClose')
exports.BatchClose = makeBatchClose(closeBatch)

exports.CutProvider = require('./lib/cropping/CutProvider')
exports.FixedCutProvider = require('./lib/cropping/FixedCutProvider')
exports.NullCutProvider = require('./lib/cropping/NullCutProvider')
exports.UnscaledFixedCutProvider = require('./lib/cropping/UnscaledFixedCutProvider')

exports.RemoteSessionEventHandler = require('./lib/events/RemoteSessionEventHandler')
exports.SessionEventHandler = require('./lib/events/SessionEventHandler')
exports.ValidationInfo = require('./lib/events/ValidationInfo')
exports.ValidationResult = require('./lib/events/ValidationResult')

exports.CheckSettings = require('./lib/fluent/CheckSettings')
exports.DriverCheckSettings = require('./lib/fluent/DriverCheckSettings')
exports.FluentRegion = require('./lib/fluent/FluentRegion')
exports.GetRegion = require('./lib/fluent/GetRegion')
exports.IgnoreRegionByRectangle = require('./lib/fluent/IgnoreRegionByRectangle')
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector')
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement')
exports.GetFloatingRegion = require('./lib/fluent/GetFloatingRegion')
exports.FloatingRegionByRectangle = require('./lib/fluent/FloatingRegionByRectangle')
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector')
exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement')
exports.GetAccessibilityRegion = require('./lib/fluent/GetAccessibilityRegion')
exports.AccessibilityRegionByRectangle = require('./lib/fluent/AccessibilityRegionByRectangle')
exports.AccessibilityRegionBySelector = require('./lib/fluent/AccessibilityRegionBySelector')
exports.AccessibilityRegionByElement = require('./lib/fluent/AccessibilityRegionByElement')
exports.TargetRegionByElement = require('./lib/fluent/TargetRegionByElement')

exports.AppOutput = require('./lib/match/AppOutput')
exports.MatchResult = require('./lib/match/MatchResult')
exports.MatchWindowAndCloseData = require('./lib/match/MatchWindowAndCloseData')
exports.MatchWindowData = require('./lib/match/MatchWindowData')
exports.ImageMatchOptions = require('./lib/match/ImageMatchOptions')

exports.metadata = {
  ActualAppOutput: require('./lib/metadata/ActualAppOutput'),
  Annotations: require('./lib/metadata/Annotations'),
  BatchInfo: require('./lib/metadata/BatchInfo'),
  Branch: require('./lib/metadata/Branch'),
  ExpectedAppOutput: require('./lib/metadata/ExpectedAppOutput'),
  Image: require('./lib/metadata/Image'),
  ImageMatchSettings: require('./lib/metadata/ImageMatchSettings'),
  SessionResults: require('./lib/metadata/SessionResults'),
  StartInfo: require('./lib/metadata/StartInfo'),
}

exports.ImageRotation = require('./lib/positioning/ImageRotation')
exports.RegionProvider = require('./lib/positioning/RegionProvider')
exports.NullRegionProvider = require('./lib/positioning/NullRegionProvider')
exports.RegionPositionCompensation = require('./lib/positioning/RegionPositionCompensation')
exports.NullRegionPositionCompensation = require('./lib/positioning/NullRegionPositionCompensation')
exports.SafariRegionPositionCompensation = require('./lib/positioning/SafariRegionPositionCompensation')
exports.RegionPositionCompensationFactory = require('./lib/positioning/RegionPositionCompensationFactory')
exports.PositionProvider = require('./lib/positioning/PositionProvider')
exports.InvalidPositionProvider = require('./lib/positioning/InvalidPositionProvider')
exports.ScrollPositionProvider = require('./lib/positioning/ScrollPositionProvider')
exports.CssTranslatePositionProvider = require('./lib/positioning/CssTranslatePositionProvider')
exports.ScrollElementPositionProvider = require('./lib/positioning/ScrollElementPositionProvider')
exports.CssTranslateElementPositionProvider = require('./lib/positioning/CssTranslateElementPositionProvider')
exports.PositionMemento = require('./lib/positioning/PositionMemento')

exports.RenderInfo = require('./lib/renderer/RenderInfo')
exports.RenderRequest = require('./lib/renderer/RenderRequest')
exports.RenderStatus = require('./lib/renderer/RenderStatus')
exports.RenderStatusResults = require('./lib/renderer/RenderStatusResults')
exports.RGridDom = require('./lib/renderer/RGridDom')
exports.RGridResource = require('./lib/renderer/RGridResource')
exports.RunningRender = require('./lib/renderer/RunningRender')
exports.EmulationInfo = require('./lib/renderer/EmulationInfo')
exports.EmulationDevice = require('./lib/renderer/EmulationDevice')

exports.ContextBasedScaleProvider = require('./lib/scaling/ContextBasedScaleProvider')
exports.ContextBasedScaleProviderFactory = require('./lib/scaling/ContextBasedScaleProviderFactory')
exports.FixedScaleProvider = require('./lib/scaling/FixedScaleProvider')
exports.FixedScaleProviderFactory = require('./lib/scaling/FixedScaleProviderFactory')
exports.NullScaleProvider = require('./lib/scaling/NullScaleProvider')
exports.ScaleProvider = require('./lib/scaling/ScaleProvider')
exports.ScaleProviderFactory = require('./lib/scaling/ScaleProviderFactory')
exports.ScaleProviderIdentityFactory = require('./lib/scaling/ScaleProviderIdentityFactory')

exports.RenderingInfo = require('./lib/server/RenderingInfo')
exports.RunningSession = require('./lib/server/RunningSession')
exports.ServerConnector = require('./lib/server/ServerConnector')
exports.getTunnelAgentFromProxy = require('./lib/server/getTunnelAgentFromProxy')
exports.SessionStartInfo = require('./lib/server/SessionStartInfo')

exports.MouseTrigger = require('./lib/triggers/MouseTrigger')
exports.TextTrigger = require('./lib/triggers/TextTrigger')
exports.Trigger = require('./lib/triggers/Trigger')

exports.AppEnvironment = require('./lib/AppEnvironment')
exports.FailureReports = require('./lib/FailureReports')
exports.MatchWindowTask = require('./lib/MatchWindowTask')
exports.TestResults = require('./lib/TestResults')
exports.TestResultsError = require('./lib/TestResultsError')
exports.AccessibilityStatus = require('./lib/AccessibilityStatus')
exports.TestResultsFormatter = require('./lib/TestResultsFormatter')
exports.TestResultsStatus = require('./lib/TestResultsStatus')

exports.EyesBase = require('./lib/sdk/EyesBase')
exports.EyesClassic = require('./lib/sdk/EyesClassic')
exports.EyesVisualGrid = require('./lib/sdk/EyesVisualGrid')
exports.EyesFactory = require('./lib/sdk/EyesFactory')
exports.EyesUtils = require('./lib/sdk/EyesUtils')
exports.EyesDriver = require('./lib/sdk/EyesDriver')
exports.EyesContext = require('./lib/sdk/EyesContext')
exports.EyesElement = require('./lib/sdk/EyesElement')
exports.EyesSDK = require('./lib/sdk/EyesSDK')

exports.takeDomCapture = require('./lib/utils/takeDomCapture')

exports.EyesRunner = require('./lib/runner/EyesRunner')
exports.ClassicRunner = require('./lib/runner/ClassicRunner')
exports.VisualGridRunner = require('./lib/runner/VisualGridRunner')
exports.RunnerOptions = require('./lib/runner/RunnerOptions')
exports.TestResultContainer = require('./lib/runner/TestResultContainer')
exports.TestResultsSummary = require('./lib/runner/TestResultsSummary')
exports.LogEvent = require('./lib/logging/LogEvent')
exports.RunnerStartedEvent = require('./lib/logging/RunnerStartedEvent')
